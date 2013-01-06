/*
	Qookery - Declarative UI Building for Qooxdoo

	Copyright (c) Ergobyte Informatics S.A., www.ergobyte.gr

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

		http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.

	$Id$
*/

/**
 * Form components are the topmost components in a Qookery form's component hierarchy,
 *
 * They are responsible, among others, for managing children components, maintaining bindings,
 * handling data validation and providing scripting contexts to event handlers.
 */
qx.Class.define("qookery.internal.components.FormComponent", {

	extend: qookery.internal.components.CompositeComponent,
	implement: [ qookery.IFormComponent ],
	include: [ qookery.util.MFuturesHandling ],

	construct: function(parentComponent, translationPrefix, variables) {
		this.base(arguments, parentComponent);
		this.__translationPrefix = translationPrefix;
		this.__variables = variables;
		this.__controller = new qx.data.controller.Object();
		this.__componentMap = { };
		this.__validations = [];
	},

	events: {
		"close": "qx.event.type.Event",
		"dispose": "qx.event.type.Event"
	},

	properties: {
		"icon": { nullable: true },
		"title": { check: "String", nullable: true },
		"valid": { check: "Boolean", init: true, nullable: false, event: "changeValid" }
	},

	members: {

		__translationPrefix: null,
		__variables: null,
		__controller: null,
		__componentMap: null,
		__validations: null,
		__clientCodeContext: null,
		__result: null,

		// Creation
		
		create: function(attributes) {
			this.base(arguments, attributes);
			if(this.getAttribute('title')) this.setTitle(this.getAttribute('title'));
			if(this.getAttribute('icon')) this.setIcon(this.getAttribute('icon'));
			this.info("Form created");
		},

		// Getters and setters
		
		getForm: function() {
			return this;
		},

		getModel: function() {
			return this.__controller.getModel();
		},

		setModel: function(model) {
			this.__controller.setModel(model);
		},

		getController: function() {
			return this.__controller;
		},

		getTranslationPrefix: function() {
			return this.__translationPrefix;
		},

		getResult: function() {
			return this.__result;
		},

		// Component registration

		getComponent: function(componentId) {
			return this.__componentMap[componentId];
		},

		registerComponent: function(component, id) {
			this.__componentMap[id] = component;
		},

		// Client script context
		
		/**
		 * Generate a JavaScript context to be used by Qookery client code
		 *
		 * @return {Object} a suitable JavaScript context
		 */
		getClientCodeContext: function() {
			if(this.__clientCodeContext != null) return this.__clientCodeContext;
			var form = this;
			var context = function(selector) {
				if(!selector)
					throw new Error("$() without a selector is not supported");
				if(selector.charAt(0) == '#')
					return form.getComponent(selector.substr(1));
				return null;
			};
			context.form = this;
			if(this.__variables)
				qx.lang.Object.mergeWith(context, this.__variables, false);
			return this.__clientCodeContext = context;
		},

		/**
		 * Register a value within the client scripting context
		 */
		registerUserContext: function(key, userContext) {
			var clientCodeContext = this.getClientCodeContext();
			clientCodeContext[key] = userContext;
		},
		
		// Event handlers

		addEventHandler: function(eventName, clientCode) {
			switch(eventName) {
			case "changeModel":
				this.__controller.addListener("changeModel", function(event) { 
					this.executeClientCode(clientCode, { "event": event }); 
				}, this);
				return;
			}
			this.base(arguments, eventName, clientCode);
		},

		// Validation
		
		/**
		 * Add a validation to the list of validations performed by this form
		 *
		 * The validator can either return a boolean or throw a {@link qx.core.ValidationError}
		 *
		 * @param component {qookery.IEditableComponent} editable component to check against
		 * @param validator {Function} validator function
		 */
		addValidation: function(component, validatorFunction) {
			if(!validatorFunction) return;
			if(!qx.Class.hasInterface(component.constructor, qookery.IEditableComponent))
				throw new Error("Component to validate must be editable");
			var validation = { 
				component: component,
				validatorFunction: validatorFunction
			};
			this.__validations.push(validation);
		},
	
		/**
		 * Remove component's validations from the form validations
		 *
		 * @param component {qookery.IEditableComponent} Component to look for, or <code>null</code> to remove all validations
		 */
		removeValidations: function(component) {
			if(this.__validations.length == 0) return;
			if(!component) { this.__validations = []; return; }
			for(var i = 0; i < this.__validations.length; i++) {
				var validation = this.__validations[i];
				if(component !== validation.component) continue;
				this.__validations.splice(i, 1); i--;
			}
		},
	
		/**
		 * Invokes the form validation
		 * 
		 * <p>The result of the validation is also set in the valid property.</p>
		 *
		 * @return {Boolean} The validation result
		 */
		validate: function() {
			var invalidComponents = [];
			for(var i = 0; i < this.__validations.length; i++) {
				var validation = this.__validations[i];
				var component = validation.component;
				var validatorFunction = validation.validatorFunction;
				var result = null;
				try {
					var value = component.getValue();
					result = validatorFunction.call(this, value, component);
					if(result === undefined) result = true;
				}
				catch(e) {
					if(e instanceof qx.core.ValidationError) {
						result = false;
						var invalidMessage = null;
						if(e.message && e.message != qx.type.BaseError.DEFAULTMESSAGE)
							invalidMessage = e.message;
						else
							invalidMessage = e.getComment();
						component.setInvalidMessage(invalidMessage);
					}
					else throw e;
				}
				if(!result) invalidComponents.push(component);
			}
			this.__validations.forEach(function(validation) {
				validation.component.setValid(invalidComponents.indexOf(validation.component) === -1);
			});
			var formValid = invalidComponents.length == 0;
			this.setValid(formValid);
			return formValid;
		},
	
		/**
		 * Resets the form validation
		 */
		resetValidation: function() {
			this.__validations.forEach(function(validation) {
				validation.component.setValid(true);
			});
			this.setValid(true);
		},

		// Closing

		/**
		 * Close the form.
		 *
		 * @param result {Object} Optional result value to set before closing
		 */
		close: function(result) {
			if(result !== undefined) this.__result = result;
			this.fireEvent("close", qx.event.type.Event, null);
		}
	},

	destruct: function() {
		this.fireEvent("dispose", qx.event.type.Event, null);
		this.__controller.removeAllBindings();
		this._disposeObjects("__controller");
		this.__componentMap = null;
		this.__validations = null;
		this.__userContextMap = null;
		this.__registration = null;
		this.__clientCodeContext = null;
		this.__translationPrefix = null;
		this.debug("Form disposed");
	}
});

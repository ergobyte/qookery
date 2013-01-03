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
		this.__validationManager = new qookery.internal.ValidatorManager();
		this.__componentMap = { };
	},

	events: {
		"close": "qx.event.type.Event",
		"dispose": "qx.event.type.Event"
	},

	members: {

		__translationPrefix: null,
		__variables: null,
		__controller: null,
		__validationManager: null,
		__componentMap: null,
		__clientCodeContext: null,
		__result: null,

		create: function(attributes) {
			this.base(arguments, attributes);
			this.info("Form created");
		},

		getTitle: function() {
			return this.getAttribute('title');
		},

		getIcon: function() {
			return this.getAttribute('icon');
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

		getComponent: function(componentId) {
			return this.__componentMap[componentId];
		},

		registerComponent: function(component, id) {
			this.__componentMap[id] = component;
		},

		registerUserContext: function(key, userContext) {
			var clientCodeContext = this.getClientCodeContext();
			clientCodeContext[key] = userContext;
		},

		getForm: function() {
			return this;
		},

		addEventHandler: function(eventName, clientCode) {
			switch(eventName) {
			case "changeValid":
				this.__validationManager.addListener("changeValid", function(event) { 
					this.executeClientCode(clientCode, { "event": event }); 
				}, this);
				return;
			case "changeModel":
				this.__controller.addListener("changeModel", function(event) { 
					this.executeClientCode(clientCode, { "event": event }); 
				}, this);
				return;
			}
			this.base(arguments, eventName, clientCode);
		},

		getValidationManager: function() {
			return this.__validationManager;
		},

		validate: function() {
			return this.__validationManager.validate();
		},

		clearValidations: function() {
			var items = this.getValidationManager().getItems();
			if(items == null) return;
			for(var item in items) {
				this.getValidationManager().remove(item);
			}
		},

		/**
		 * Disposes the form.
		 *
		 * @param {} result The exit value of the component
		 */
		close: function(result) {
			if(result) this.__result = result;
			this.fireEvent("close", qx.event.type.Event, null);
		},

		getTranslationPrefix: function() {
			return this.__translationPrefix;
		},

		getResult: function() {
			return this.__result;
		},

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
		}
	},

	destruct: function() {
		this.fireEvent("dispose", qx.event.type.Event, null);
		this.__controller.removeAllBindings();
		this._disposeObjects("__validationManager", "__controller", "__validationManager");
		this.__componentMap = null;
		this.__userContextMap = null;
		this.__registration = null;
		this.__clientCodeContext = null;
		this.__translationPrefix = null;
		this.debug("Form disposed");
	}
});

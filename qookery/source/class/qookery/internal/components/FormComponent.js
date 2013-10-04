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

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
		this.__components = { };
		this.__validations = [];
		this.__bindings = { };
		this.__targets = [ ];
	},

	events: {
		"close": "qx.event.type.Event",
		"dispose": "qx.event.type.Event"
	},

	properties: {
		"icon": { nullable: true },
		"title": { nullable: true, check: "String", event: "changeTitle"},
		"valid": { nullable: false, check: "Boolean", init: true, event: "changeValid" },
		"model": { nullable: true, dereference: true, event: "changeModel", apply: "_applyModel" }
	},

	members: {

		__translationPrefix: null,
		__variables: null,
		__components: null,
		__validations: null,
		__modelProvider: null,
		__targets: null,
		__bindings: null,
		__clientCodeContext: null,
		__result: null,

		// Creation

		prepare: function(formParser, xmlElement) {
			this.__variables = formParser.getVariables();
			this.__translationPrefix = formParser.getAttribute(xmlElement, 'translation-prefix');
		},

		create: function(attributes) {
			this.base(arguments, attributes);
			this.__modelProvider = qookery.Qookery.getRegistry().getModelProvider(attributes['model-provider']);
			var icon = this.getAttribute('icon');
			if(icon) this.setIcon(icon);
			this.info("Created form", this.getId() || "");
		},

		setup: function(attributes) {
			var title = this.getAttribute('title');
			if(title) this.setTitle(title instanceof qx.locale.LocalizedString ? title.translate() : title);
			return this.base(arguments);
		},

		// Getters and setters

		getForm: function() {
			return this;
		},

		getTranslationPrefix: function() {
			return this.__translationPrefix;
		},

		getModelProvider: function() {
			return this.__modelProvider;
		},

		getResult: function() {
			return this.__result;
		},

		// Component registration

		getComponent: function(componentId) {
			return this.__components[componentId];
		},

		putComponent: function(componentId, component) {
			this.__components[componentId] = component;
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
			var errorMessages = [];
			for(var i = 0; i < this.__validations.length; i++) {
				var validation = this.__validations[i];
				var component = validation.component;
				var validatorFunction = validation.validatorFunction;
				var invalidMessage = null;
				try {
					var value = component.getValue();
					invalidMessage = validatorFunction.call(this, value, component);
					if(!invalidMessage) continue;
				}
				catch(e) {
					if(e instanceof qx.core.ValidationError) {
						if(e.message && e.message != qx.type.BaseError.DEFAULTMESSAGE)
							invalidMessage = e.message;
						else
							invalidMessage = e.getComment();
					}
					else throw e;
				}
				if(!invalidMessage) invalidMessage = "Unknown error";
				component.getMainWidget().setInvalidMessage(invalidMessage);
				errorMessages.push({ 'component': component, 'message': invalidMessage });
				invalidComponents.push(component);
			}
			this.__validations.forEach(function(validation) {
				validation.component.setValid(invalidComponents.indexOf(validation.component) === -1);
			});
			var formValid = invalidComponents.length == 0;
			invalidMessage = this.executeAction("validate");
			if(invalidMessage) {
				formValid = false;
				errorMessages.push({ 'component': null, 'message': invalidMessage });
			}
			this.setValid(formValid);
			if(errorMessages.length == 0)
				return null;
			return errorMessages;
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
		},

		parseCustomElement: function(formParser, xmlElement) {
			var elementName = qx.dom.Node.getName(xmlElement);
			switch(elementName) {
				case "bind":
					this.__parseBind(formParser, xmlElement);
					return true;
				case "import":
					this.__parseImport(formParser, xmlElement);
					return true;
				case "translation":
					this.__parseTranslation(formParser, xmlElement);
					return true;
			}
			return false;
		},

		__parseBind: function(formParser, bindElement) {
			var prefix = formParser.getAttribute(bindElement, "prefix");
			var namespaceUri = formParser.getAttribute(bindElement, "uri");
			formParser.setNamespacePrefix(prefix, namespaceUri);
		},

		__parseImport: function(formParser, importElement) {
			var className = formParser.getAttribute(importElement, "class");
			var clazz = qx.Class.getByName(className);
			if(!clazz) throw new Error(qx.lang.String.format("Imported class '%1' not found", [ className ]));
			var key = formParser.getAttribute(importElement, "key");
			if(!key) key = className.substring(className.lastIndexOf(".") + 1);
			this.registerUserContext(key, clazz);
		},

		__parseTranslation: function(formParser, translationElement) {
			if(!qx.dom.Element.hasChildren(translationElement)) return;
			var languageCode = qx.xml.Element.getAttributeNS(translationElement, 'http://www.w3.org/XML/1998/namespace', 'lang');
			if(!languageCode) throw new Error("Language code missing");
			var messages = { };
			var prefix = this.getTranslationPrefix();
			var children = qx.dom.Hierarchy.getChildElements(translationElement);
			for(var i = 0; i < children.length; i++) {
				var messageElement = children[i];
				var elementName = qx.dom.Node.getName(messageElement);
				if(elementName != 'message')
					throw new Error(qx.lang.String.format("Unexpected XML element '%1' in translation block", [ elementName ]));
				var messageId = formParser.getAttribute(messageElement, "id");
				if(!messageId) throw new Error("Message identifier missing");
				if(prefix) messageId = prefix + '.' + messageId;
				messages[messageId] = formParser.getNodeText(messageElement);
			}
			qx.locale.Manager.getInstance().addTranslation(languageCode, messages);
		},

		// Controller methods follow, actually copy-pasted from qx.data.controller.Object

		_applyModel: function(newModel, oldModel) {
			for(var i = 0; i < this.__targets.length; i++) {
				var targetObject = this.__targets[i][0];
				var targetProperty = this.__targets[i][1];
				var sourceProperty = this.__targets[i][2];
				var bidirectional = this.__targets[i][3];
				var options = this.__targets[i][4];
				var reverseOptions = this.__targets[i][5];
				if(oldModel != undefined) {
					this.__removeTargetFrom(targetObject, targetProperty, sourceProperty, oldModel);
				}
				if(newModel != undefined) {
					this.__addTarget(targetObject, targetProperty, sourceProperty, bidirectional, options, reverseOptions);
					continue;
				}
				if(targetObject == "undefined" || qx.core.ObjectRegistry.inShutDown) {
					continue;
				}
				if(targetProperty.indexOf("[") == -1) {
					targetObject["reset" + qx.lang.String.firstUp(targetProperty)]();
				}
				else {
					var open = targetProperty.indexOf("[");
					var index = parseInt(targetProperty.substring(open + 1, targetProperty.length - 1), 10);
					targetProperty = targetProperty.substring(0, open);
					var targetArray = targetObject["get" + qx.lang.String.firstUp(targetProperty)]();
					if(index == "last") {
						index = targetArray.length;
					}
					if(targetArray) {
						targetArray.setItem(index, null);
					}
				}
			}
		},

		addTarget: function(targetObject, targetProperty, sourceProperty, bidirectional, options, reverseOptions) {
			this.__targets.push([ targetObject, targetProperty, sourceProperty, bidirectional, options, reverseOptions ]);
			this.__addTarget(targetObject, targetProperty, sourceProperty, bidirectional, options, reverseOptions);
		},

		__addTarget: function(targetObject, targetProperty, sourceProperty, bidirectional, options, reverseOptions) {
			if(this.getModel() == null) return;
			var id = this.getModel().bind(sourceProperty, targetObject, targetProperty, options);
			var idReverse = !bidirectional ? null :
				targetObject.bind(targetProperty, this.getModel(), sourceProperty, reverseOptions);
			var targetHash = targetObject.toHashCode();
			if(this.__bindings[targetHash] == undefined) {
				this.__bindings[targetHash] = [ ];
			}
			this.__bindings[targetHash].push(
					[ id, idReverse, targetProperty, sourceProperty, options, reverseOptions ]);
		},

		removeTarget: function(targetObject, targetProperty, sourceProperty) {
			this.__removeTargetFrom(targetObject, targetProperty, sourceProperty, this.getModel());
			for(var i = 0; i < this.__targets.length; i++) {
				if(this.__targets[i][0] == targetObject && this.__targets[i][1] == targetProperty && this.__targets[i][2] == sourceProperty)
					this.__targets.splice(i, 1);
			}
		},

		__removeTargetFrom: function(targetObject, targetProperty, sourceProperty, sourceObject) {
			if(!(targetObject instanceof qx.core.Object)) {
				return;
			}
			var currentListing = this.__bindings[targetObject.toHashCode()];
			if(currentListing == undefined || currentListing.length == 0) {
				return;
			}
			for(var i = 0; i < currentListing.length; i++) {
				if(currentListing[i][2] == targetProperty && currentListing[i][3] == sourceProperty) {
					var id = currentListing[i][0];
					sourceObject.removeBinding(id);
					if(currentListing[i][1] != null) {
						targetObject.removeBinding(currentListing[i][1]);
					}
					currentListing.splice(i, 1);
					return;
				}
			}
		}
	},

	destruct: function() {
		this.fireEvent("dispose", qx.event.type.Event, null);
		this.removeAllBindings();
		this.__components = null;
		this.__validations = null;
		this.__userContextMap = null;
		this.__registration = null;
		this.__clientCodeContext = null;
		this.__translationPrefix = null;
		this.info("Destructed form", this.getId() || "");
	}
});

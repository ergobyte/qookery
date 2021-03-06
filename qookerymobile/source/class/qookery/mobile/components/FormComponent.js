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
*/

/**
 * Form components are the topmost components in a Qookery form's component hierarchy,
 *
 * They are responsible, among others, for managing children components, maintaining bindings,
 * handling data validation and providing scripting contexts to event handlers.
 */
qx.Class.define("qookery.mobile.components.FormComponent", {

	extend: qookery.mobile.components.CompositeComponent,
	implement: [ qookery.IFormComponent ],
	include: [ qookery.util.MFuturesHandling ],

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
		this.__components = { };
		this.__connections = [ ];
	},

	events: {
		"close": "qx.event.type.Event"
	},

	properties: {
		"icon": { nullable: true },
		"title": { nullable: true, check: "String", event: "changeTitle"},
		"valid": { nullable: false, check: "Boolean", init: true, event: "changeValid" },
		"model": { nullable: true, dereference: true, event: "changeModel", apply: "_applyModel" }
	},

	members: {

		__variables: null,
		__namespaces: null,
		__translationPrefix: null,
		__components: null,
		__modelProvider: null,
		__connections: null,
		__clientCodeContext: null,

		// Creation

		create: function(attributes) {
			this.base(arguments, attributes);
			this.__modelProvider = qookery.Qookery.getRegistry().getModelProvider(this.getAttribute("model-provider"));
			var icon = this.getAttribute("icon");
			if(icon) this.setIcon(icon);
			this.debug("Created form", this.getId() || "");
		},

		setup: function() {
			var title = this.getAttribute("title");
			if(title) this.setTitle(title instanceof qx.locale.LocalizedString ? title.translate() : title);
			return this.base(arguments);
		},

		focus: function() {
			this.executeAction("onFocusReceived");
		},

		// Getters and setters

		isMobile: function() {
			return this.getAttribute("xmlns") === "http://www.qookery.org/ns/Form/Mobile";
		},

		getForm: function() {
			return this;
		},

		getParentForm: function() {
			return this.__variables["parentForm"];
		},

		getTranslationPrefix: function() {
			return this.__translationPrefix;
		},

		getModelProvider: function() {
			return this.__modelProvider;
		},

		// Variables

		getVariable: function(variableName) {
			return this.__variables[variableName];
		},

		setVariable: function(variableName, value) {
			this.__variables[variableName] = value;
		},

		clearVariables: function() {
			for(var variableName in this.__variables) {
				if(this.__variables.hasOwnProperty(variableName)) {
					delete this.__variables[variableName];
				}
			}
		},

		// Component registration

		getComponent: function(componentId) {
			return this.__components[componentId];
		},

		putComponent: function(componentId, component) {
			this.__components[componentId] = component;
		},

		// Client script context

		getClientCodeContext: function() {
			if(this.__clientCodeContext != null) return this.__clientCodeContext;
			var form = this;
			var context = function(selector) {
				if(selector == null) {
					return this;
				}
				if(selector.charAt(0) == "#") {
					return form.getComponent(selector.substr(1));
				}
				return null;
			};
			context["form"] = // Deprecated, use capitalized version $.Form
			context["Form"] = this;
			qx.lang.Object.mergeWith(context, this.__variables, false);
			return this.__clientCodeContext = context;
		},

		registerUserContext: function(key, userContext) {
			var clientCodeContext = this.getClientCodeContext();
			clientCodeContext[key] = userContext;
		},

		// Validation

		validate: function() {
			var baseError = this.base(arguments);
			var actionError = this.executeAction("validate");
			if(baseError == null && actionError == null) {
				this.setValid(true);
				return null;
			}
			var errors = [ ];
			if(baseError) errors.push(baseError);
			if(actionError) {
				if(qx.lang.Type.isString(actionError))
					errors.push(new qookery.util.ValidationError(this, actionError));
				else
					errors.push(actionError);
			}
			this.setValid(false);
			var message = this.tr("qookery.internal.components.FormComponent.validationErrors", this.getTitle());
			return new qookery.util.ValidationError(this, message, errors);
		},

		parseXmlElement: function(elementName, element) {
			switch(elementName) {
			case "{http://www.qookery.org/ns/Form}import":
				this.__parseImport(element);
				return true;
			case "{http://www.qookery.org/ns/Form}translation":
				this.__parseTranslation(element);
				return true;
			}
			return false;
		},

		__parseImport: function(importElement) {
			var className = qookery.util.Xml.getAttribute(importElement, "class", Error);
			var clazz = qx.Class.getByName(className);
			if(clazz == null)
				throw new Error(qx.lang.String.format("Imported class '%1' not found", [ className ]));
			var key = qookery.util.Xml.getAttribute(importElement, "key");
			if(key == null)
				key = className.substring(className.lastIndexOf(".") + 1);
			this.registerUserContext(key, clazz);
		},

		__parseTranslation: function(translationElement) {
			if(!qx.dom.Element.hasChildren(translationElement)) return;
			var languageCode = qx.xml.Element.getAttributeNS(translationElement, "http://www.w3.org/XML/1998/namespace", "lang");
			if(!languageCode) throw new Error("Language code missing");
			var messages = { };
			var prefix = this.getTranslationPrefix();
			var children = qx.dom.Hierarchy.getChildElements(translationElement);
			for(var i = 0; i < children.length; i++) {
				var messageElement = children[i];
				var elementName = qx.dom.Node.getName(messageElement);
				if(elementName != "message")
					throw new Error(qx.lang.String.format("Unexpected XML element '%1' in translation block", [ elementName ]));
				var messageId = qookery.util.Xml.getAttribute(messageElement, "id", Error);
				if(prefix) messageId = prefix + "." + messageId;
				messages[messageId] = qookery.util.Xml.getNodeText(messageElement);
			}
			qx.locale.Manager.getInstance().addTranslation(languageCode, messages);
		},

		// Closing

		close: function(result) {
			if(this.isDisposed()) return;
			if(result !== undefined) this.__variables["result"] = result;
			this.fireDataEvent("close", this.__variables["result"]);
		},

		// Model connection

		addConnection: function(editableComponent, modelPropertyPath) {
			var connection = new qookery.internal.util.Connection(editableComponent, modelPropertyPath);
			this.__connections.push(connection);
			connection.connect(this.getModel()); // Attempt model connection immediately
			return connection;
		},

		removeConnection: function(connection) {
			connection.disconnect();
			for(var i = 0; i < this.__connections.length; i++) {
				if(connection.equals(this.__connections[i]))
					this.__connections.splice(i, 1);
			}
		},

		_applyModel: function(model) {
			for(var i = 0; i < this.__connections.length; i++) {
				var connection = this.__connections[i];
				connection.connect(model);
			}
		}
	},

	destruct: function() {
		for(var i = 0; i < this.__connections.length; i++) this.__connections[i].disconnect();
		this.__components = null;
		this.__validations = null;
		this.__userContextMap = null;
		this.__registration = null;
		this.__clientCodeContext = null;
		this.__translationPrefix = null;
		this.__variables = null;
		this.debug("Destructed form", this.getId() || "");
	}
});

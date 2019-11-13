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

qx.Class.define("qookery.internal.components.FormComponent", {

	extend: qookery.internal.components.CompositeComponent,
	implement: [ qookery.IFormComponent ],

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
		this.__state = "NEW";
		this.__components = { };
		this.__connections = [ ];
	},

	events: {
		"close": "qx.event.type.Data",
		"ready": "qx.event.type.Event"
	},

	properties: {
		"icon": { nullable: true },
		"title": { nullable: true, check: "String", event: "changeTitle" },
		"valid": { nullable: false, check: "Boolean", init: true, event: "changeValid" },
		"model": { nullable: true, dereference: true, event: "changeModel", apply: "_applyModel" }
	},

	members: {

		__state: null,
		__components: null,
		__connections: null,
		__scriptingContext: null,
		__serviceResolver: null,
		__translationPrefix: null,
		__operationQueue: null,
		__modelProvider: null,

		// Metadata

		getAttributeType: function(attributeName) {
			switch(attributeName) {
			case "title": return "ReplaceableString";
			}
			return this.base(arguments, attributeName);
		},

		setAttribute: function(attributeName, value) {
			switch(attributeName) {
			case qookery.IFormComponent.A_SERVICE_RESOLVER:
				this.__serviceResolver = value;
				return;
			case qookery.IFormComponent.A_TRANSLATION_PREFIX:
				this.__translationPrefix = value;
				return;
			case qookery.IFormComponent.A_VARIABLES:
				this.__scriptingContext = this.$ = this.__createScriptingContext(value);
				return;
			}
			return this.base(arguments, attributeName, value);
		},

		// Lifecycle

		create: function(attributes) {
			this.__enableOperationQueuing();
			this.debug("Created");
			this.base(arguments, attributes);
			this.__modelProvider = qookery.Qookery.getRegistry().getModelProvider(this.getAttribute("model-provider"));
			this._applyAttribute("icon", this, "icon");
		},

		setup: function() {
			var title = this.getAttribute("title");
			if(title !== undefined)
				this.setTitle(title instanceof qx.locale.LocalizedString ? title.translate() : title);
			this.__flushOperationQueue();
			return this.base(arguments);
		},

		focus: function() {
			// Do not handle form focus on touch devices - this is a hack to prevent the virtual keyboard from
			// popping up when the XML author sets the focus to text fields (and other components)
			if(qx.core.Environment.get("device.touch")) return;
			if(this.isActionSupported("onFocusReceived")) {
				this.executeAction("onFocusReceived");
				return;
			}
			var selectedComponent, smallestTabIndex;
			qookery.contexts.Qookery.descendComponents(this, function(component) {
				if(!component.isFocusable())
					return;
				var tabIndex = component.getAttribute("tab-index", Number.MAX_VALUE);
				if(tabIndex >= smallestTabIndex)
					return;
				smallestTabIndex = tabIndex;
				selectedComponent = component;
			}, this);
			if(selectedComponent != null)
				selectedComponent.focus();
		},

		isReady: function() {
			return this.__state === "READY";
		},

		markAsReady: function() {
			if(this.__state !== "NEW")
				return;
			this.__state = "READY";
			this.fireEvent("ready");
		},

		// Getters and setters

		getForm: function() {
			return this;
		},

		getParentForm: function() {
			var parentForm = this.getVariable("parentForm");
			if(parentForm != null) return parentForm;
			var parentComponent = this.getParent();
			if(!parentComponent) return null;
			return parentComponent.getForm();
		},

		getTranslationPrefix: function() {
			return this.__translationPrefix;
		},

		getModelProvider: function() {
			return this.__modelProvider;
		},

		// Services

		resolveService: function(serviceName) {
			var resolver = this.__serviceResolver;
			if(resolver != null) {
				var service = resolver(serviceName);
				if(service != null)
					return service;
			}
			var parentForm = this.getParentForm();
			if(parentForm != null)
				return parentForm.resolveService(serviceName);
			return qookery.Qookery.getService(serviceName, false);
		},

		// Variables

		getVariable: function(variableName, defaultValue) {
			var value = this.__scriptingContext[variableName];
			if(value !== undefined) return value;
			return defaultValue;
		},

		setVariable: function(variableName, value) {
			this.__scriptingContext[variableName] = value;
		},

		// Component registration

		getComponent: function(componentId, required) {
			var component = this.__components[componentId];
			if(component == null && required === true)
				throw new Error(qx.lang.String.format("Reference to unregistered component '%1'", [ componentId ]));
			return component;
		},

		putComponent: function(componentId, component) {
			this.__components[componentId] = component;
		},

		// Client scripting context

		getScriptingContext: function() {
			var context = this.__scriptingContext;
			if(context == null)
				throw new Error("Scripting context is not available");
			return context;
		},

		// Validation

		validate: function() {
			if(this.__queueOperation(this.validate)) return null;
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

		parseXmlElement: function(elementName, xmlElement) {
			switch(elementName) {
			case "{http://www.qookery.org/ns/Form}import":
				this.__parseImport(xmlElement);
				return true;
			case "{http://www.qookery.org/ns/Form}translation":
				this.__parseTranslation(xmlElement);
				return true;
			case "{http://www.qookery.org/ns/Form}variable":
				this.__parseVariable(xmlElement);
				return true;
			}
			return false;
		},

		// Internals

		__createScriptingContext: function(variables) {
			var context = function(selector) {
				if(selector == null) {
					return this;
				}
				if(selector === ":parent") {
					return this.getParentForm();
				}
				if(selector.charAt(0) === "#") {
					return this.getComponent(selector.substr(1));
				}
				return null;
			}.bind(this);
			context["form"] = // Deprecated, use capitalized version $.Form
			context["Form"] = this;
			if(variables != null) qx.lang.Object.mergeWith(context, variables, false);
			return context;
		},

		__parseImport: function(importElement) {
			var name = null, getter = null;
			var className = qookery.util.Xml.getAttribute(importElement, "class");
			if(className != null) {
				name = className;
				getter = function() { return qx.Class.getByName(className); };
			}
			var formName = qookery.util.Xml.getAttribute(importElement, "form");
			if(formName != null) {
				name = formName;
				getter = function() {
					var form = this;
					do {
						if(form.getId() === formName) return form;
						form = form.getParentForm();
					}
					while(form != null);
				}.bind(this);
			}
			var serviceName = qookery.util.Xml.getAttribute(importElement, "service");
			if(serviceName != null) {
				name = serviceName;
				getter = this.resolveService.bind(this, serviceName);
			}
			var singletonName = qookery.util.Xml.getAttribute(importElement, "singleton");
			if(singletonName != null) {
				name = singletonName;
				getter = function() { return qx.Class.getByName(singletonName).getInstance(); };
			}
			if(name == null || getter == null) {
				throw new Error("Invalid <import> element");
			}
			var variableName = qookery.util.Xml.getAttribute(importElement, "variable");
			if(variableName == null) {
				variableName = name.substring(name.lastIndexOf(".") + 1);
			}
			if(this.__scriptingContext.hasOwnProperty(variableName)) {
				throw new Error("Variable '" + variableName + "' has already been defined");
			}
			var isRequired = qookery.util.Xml.getAttribute(importElement, "optional") !== "true";
			var onDemand = qookery.util.Xml.getAttribute(importElement, "resolution") === "on-demand";
			if(!onDemand) {
				var value = getter();
				if(value == null && isRequired)
					throw new Error("Unable to resolve required import '" + name + "'");
				getter = function() { return value; };
			}
			else if(isRequired) {
				var g = getter;
				getter = function() {
					var value = g();
					if(value == null)
						throw new Error("Unable to resolve required import '" + name + "'");
					return value;
				};
			}
			Object.defineProperty(this.__scriptingContext, variableName, {
				configurable: false,
				enumerable: false,
				get: getter,
				set: function(v) { throw new Error("Illegal write access to form import"); }
			});
		},

		__parseTranslation: function(translationElement) {
			if(!qx.dom.Element.hasChildren(translationElement)) return;
			var languageCode = qx.xml.Element.getAttributeNS(translationElement, "http://www.w3.org/XML/1998/namespace", "lang");
			if(languageCode == null)
				throw new Error("Language code missing");
			var messages = { };
			var children = qx.dom.Hierarchy.getChildElements(translationElement);
			for(var i = 0; i < children.length; i++) {
				var messageElement = children[i];
				var elementName = qx.dom.Node.getName(messageElement);
				if(elementName != "message")
					throw new Error(qx.lang.String.format("Unexpected XML element '%1' in translation block", [ elementName ]));
				var messageId = qookery.util.Xml.getAttribute(messageElement, "id", Error);
				if(this.__translationPrefix != null)
					messageId = this.__translationPrefix + "." + messageId;
				messages[messageId] = qookery.util.Xml.getNodeText(messageElement);
			}
			qx.locale.Manager.getInstance().addTranslation(languageCode, messages);
		},

		__parseVariable: function(variableElement) {
			var variableName = qookery.util.Xml.getAttribute(variableElement, "name", Error);
			var providerName = qookery.util.Xml.getAttribute(variableElement, "provider", "Form");
			var provider = this.__scriptingContext[providerName];
			if(provider == null || !qx.Class.hasInterface(provider.constructor, qookery.IVariableProvider))
				throw new Error("Variable provider '" + providerName + "' missing from scripting context");
			var value = provider.getVariable(variableName);
			if(value == null) {
				var defaultValue = qookery.util.Xml.getNodeText(variableElement);
				if(defaultValue == null)
					defaultValue = qookery.util.Xml.getAttribute(variableElement, "default");
				if(defaultValue != null) {
					var typeName = qookery.util.Xml.getAttribute(variableElement, "type", "Expression");
					value = qookery.util.Xml.parseValue(this, typeName, defaultValue);
				}
				if(value === undefined) value = null;
				if(value === null && qookery.util.Xml.getAttribute(variableElement, "required") === "true")
					throw new Error("Value for required variable '" + variableName + "' is missing");
				provider.setVariable(variableName, value);
			}
			if(provider === this) return;
			var writable = qookery.util.Xml.getAttribute(variableElement, "writable") !== "false";
			var setFunction = writable ?
				function(v) { provider.setVariable(variableName, v); } :
				function(v) { throw new Error("Illegal attempt to modify non-writable variable '" + variableName + "'"); };
			Object.defineProperty(this.__scriptingContext, variableName, {
				configurable: false,
				enumerable: true,
				get: function() { return provider.getVariable(variableName); },
				set: setFunction
			});
		},

		// Operations

		close: function(result) {
			if(this.isDisposed()) return;
			if(result !== undefined) this.__scriptingContext["result"] = result;
			this.fireDataEvent("close", result);
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
		},

		// Miscellaneous implementations

		toString: function() {
			var hash = this.getId() || this.$$hash;
			return this.classname + "[" + hash + "]";
		},

		// Operation queuing

		__enableOperationQueuing: function() {
			this.__operationQueue = [ ];
		},

		__queueOperation: function(operation) {
			if(this.__operationQueue === null) return false;
			if(this.__operationQueue.indexOf(operation) === -1)
				this.__operationQueue.push(operation);
			return true;
		},

		__flushOperationQueue: function() {
			if(this.__operationQueue === null) return;
			var queue = this.__operationQueue;
			this.__operationQueue = null;
			if(queue.length === 0) return;
			for(var i = 0; i < queue.length; i++) {
				var operation = queue[i];
				operation.call(this);
			}
		}
	},

	destruct: function() {
		this.__state = "DISPOSED";
		for(var i = 0; i < this.__connections.length; i++)
			this.__connections[i].disconnect();
		this.debug("Destructed");
	}
});

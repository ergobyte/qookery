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
		this.__components = { };
		this.__connections = [ ];
	},

	events: {
		"close": "qx.event.type.Data"
	},

	properties: {
		"icon": { nullable: true },
		"title": { nullable: true, check: "String", event: "changeTitle" },
		"valid": { nullable: false, check: "Boolean", init: true, event: "changeValid" },
		"model": { nullable: true, dereference: true, event: "changeModel", apply: "_applyModel" }
	},

	members: {

		__translationPrefix: null,
		__components: null,
		__modelProvider: null,
		__connections: null,
		__scriptingContext: null,
		__serviceResolver: null,
		__operationQueue: null,

		// Metadata

		getAttributeType: function(attributeName) {
			switch(attributeName) {
			case "title": return "ReplaceableString";
			}
			return this.base(arguments, attributeName);
		},

		// Creation

		prepare: function(formParser, xmlElement) {
			this.__serviceResolver = formParser.getServiceResolver();
			this.__scriptingContext = this.$ = this.__createScriptingContext(formParser.getVariables());
			this.__translationPrefix = formParser.getAttribute(xmlElement, "translation-prefix");
			if(!this.__translationPrefix)
				this.__translationPrefix = formParser.getAttribute(xmlElement, "id");
			this.__enableOperationQueuing();
		},

		create: function(attributes) {
			this.base(arguments, attributes);
			this.__modelProvider = qookery.Qookery.getRegistry().getModelProvider(attributes["model-provider"]);
			var icon = this.getAttribute("icon");
			if(icon) this.setIcon(icon);
			this.debug("Created form");
		},

		setup: function(formParser, attributes) {
			var title = this.getAttribute("title");
			if(title)
				this.setTitle(title instanceof qx.locale.LocalizedString ? title.translate() : title);
			this.__flushOperationQueue();
			return this.base(arguments, formParser, attributes);
		},

		focus: function() {
			// Do not handle form focus on touch devices - this is a hack to prevent the virtual keyboard from
			// popping up when the XML author sets the focus to text fields (and other components)
			if(qx.core.Environment.get("device.touch")) return;
			this.executeAction("onFocusReceived");
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
			if(resolver == null)
				return null;
			var service = resolver(serviceName);
			if(service != null)
				return service;
			var parentForm = this.getParentForm();
			if(parentForm != null)
				return parentForm.resolveService(serviceName);
			return null;
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
			case "variable":
				this.__parseVariable(formParser, xmlElement);
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

		__parseBind: function(formParser, bindElement) {
			var prefix = formParser.getAttribute(bindElement, "prefix");
			var namespaceUri = formParser.getAttribute(bindElement, "uri");
			formParser.setNamespacePrefix(prefix, namespaceUri);
		},

		__parseImport: function(formParser, importElement) {
			var value = null, name = null;
			var className = formParser.getAttribute(importElement, "class");
			if(className != null) {
				value = qx.Class.getByName(className);
				name = className;
			}
			var formName = formParser.getAttribute(importElement, "form");
			if(formName != null) {
				var form = this;
				do {
					if(form.getId() === formName) {
						value = form;
						break;
					}
					form = form.getParentForm();
				}
				while(form != null);
				name = formName;
			}
			var serviceName = formParser.getAttribute(importElement, "service");
			if(serviceName != null) {
				value = this.resolveService(serviceName);
				name = serviceName;
			}
			if(name == null) {
				throw new Error("Invalid <import> element");
			}
			if(value == null && formParser.getAttribute(importElement, "optional") !== "true") {
				throw new Error("Unable to resolve required import '" + name + "'");
			}
			var variableName = formParser.getAttribute(importElement, "variable");
			if(variableName == null) {
				variableName = name.substring(name.lastIndexOf(".") + 1);
			}
			if(this.__scriptingContext.hasOwnProperty(variableName))
				throw new Error("Variable '" + variableName + "' has already been defined");
			Object.defineProperty(this.__scriptingContext, variableName, {
				configurable: false,
				enumerable: false,
				get: function() { return value; },
				set: function(v) { throw new Error("Illegal write access to form import"); }
			});
		},

		__parseTranslation: function(formParser, translationElement) {
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
				var messageId = formParser.getAttribute(messageElement, "id");
				if(!messageId) throw new Error("Message identifier missing");
				if(prefix) messageId = prefix + "." + messageId;
				messages[messageId] = formParser.getNodeText(messageElement);
			}
			qx.locale.Manager.getInstance().addTranslation(languageCode, messages);
		},

		__parseVariable: function(formParser, variableElement) {
			var variableName = formParser.getAttribute(variableElement, "name");
			if(variableName == null)
				throw new Error("Variable name is required");
			var provider = this;
			var providerName = formParser.getAttribute(variableElement, "provider");
			if(providerName != null && providerName !== "Form") {
				provider = this.__scriptingContext[providerName];
				if(provider == null || !qx.Class.hasInterface(provider.constructor, qookery.IVariableProvider))
					throw new Error("Variable provider '" + providerName + "' missing from scripting context");
			}
			var value = provider.getVariable(variableName);
			if(value == null) {
				var defaultValue = formParser.getAttribute(variableElement, "default");
				if(defaultValue != null) {
					var typeName = formParser.getAttribute(variableElement, "type", "Expression");
					value = formParser.parseValue(this, typeName, defaultValue);
				}
				if(value === undefined) value = null;
				if(value === null && formParser.getAttribute(variableElement, "required") === "true")
					throw new Error("Value for required variable '" + variableName + "' is missing");
				provider.setVariable(variableName, value);
			}
			if(provider === this) return;
			var writable = formParser.getAttribute(variableElement, "writable") !== "false";
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
		for(var i = 0; i < this.__connections.length; i++) this.__connections[i].disconnect();
		this.__components = null;
		this.__validations = null;
		this.__userContextMap = null;
		this.__registration = null;
		this.__scriptingContext = null;
		this.__serviceResolver = null;
		this.__translationPrefix = null;
		this.debug("Destructed form");
	}
});

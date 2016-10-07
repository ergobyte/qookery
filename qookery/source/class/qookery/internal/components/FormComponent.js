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
 * Forms are containers that lay the necessary groundwork for Qookery components
 *
 * <p>Among others, they cater for:</p>
 * <ul>
 *	<li>context bindings</li>
 *	<li>client scripting</li>
 *	<li>model connections</li>
 *	<li>component validation</li>
 *	<li>translation support</li>
 * </ul>
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

		__variables: null,
		__translationPrefix: null,
		__components: null,
		__modelProvider: null,
		__connections: null,
		__clientCodeContext: null,
		__operationQueue: null,
		__disposeList: null,

		// Metadata

		getAttributeType: function(attributeName) {
			switch(attributeName) {
			case "title": return "ReplaceableString";
			}
			return this.base(arguments, attributeName);
		},

		// Creation

		prepare: function(formParser, xmlElement) {
			this.__variables = formParser.getVariables() || { };
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
			this.debug("Created form", this.getId() || "");
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
			var parentForm = this.__variables["parentForm"];
			if(parentForm !== undefined) return parentForm;
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

		// Variables

		getVariable: function(variableName, defaultValue) {
			var value = this.__variables[variableName];
			if(value !== undefined) return value;
			return defaultValue;
		},

		setVariable: function(variableName, value) {
			this.__variables[variableName] = value;
		},

		getVariableRecursively: function(variableName) {
			return qookery.contexts.Qookery.ascendForms(this, function(f) {
				var value = f.getVariable(variableName);
				if(value !== undefined) return value;
			})
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
				if(!selector)
					throw new Error("$() without a selector is not supported");
				if(selector.charAt(0) == "#")
					return form.getComponent(selector.substr(1));
				return null;
			};
			context["form"] = this;
			context["parent"] = function() {
				var parentForm = this.getParentForm();
				if(!parentForm) return undefined;
				return parentForm.getClientCodeContext();
			}.bind(this);
			qx.lang.Object.mergeWith(context, this.__variables, false);
			return this.__clientCodeContext = context;
		},

		registerUserContext: function(key, userContext) {
			var clientCodeContext = this.getClientCodeContext();
			clientCodeContext[key] = userContext;
		},

		addToDisposeList: function(disposable) {
			if(!this.__disposeList) this.__disposeList = [ ];
			this.__disposeList.push(disposable);
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
			}
			return false;
		},

		__parseBind: function(formParser, bindElement) {
			var prefix = formParser.getAttribute(bindElement, "prefix");
			var namespaceUri = formParser.getAttribute(bindElement, "uri");
			formParser.setNamespacePrefix(prefix, namespaceUri);
		},

		__parseImport: function(formParser, importElement) {
			var instance = null;
			var key = formParser.getAttribute(importElement, "key");
			var optional = formParser.getAttribute(importElement, "optional") === "true";
			var className = formParser.getAttribute(importElement, "class");
			if(className) {
				instance = qx.Class.getByName(className);
				if(!instance) {
					if(!optional) throw new Error(qx.lang.String.format("Imported class '%1' not found", [ className ]));
					return;
				}
				if(!key) key = className.substring(className.lastIndexOf(".") + 1);
			}
			var serviceName = formParser.getAttribute(importElement, "service");
			if(serviceName) {
				instance = qookery.Qookery.getService(serviceName);
				if(!instance) {
					if(!optional) throw new Error(qx.lang.String.format("Imported service '%1' not available", [ serviceName ]));
					return;
				}
				if(!key) key = serviceName;
			}
			if(!instance) throw new Error("Not enough arguments provided to <import> element");
			this.registerUserContext(key, instance);
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

		// Operations

		close: function(result) {
			if(this.isDisposed()) return;
			if(result !== undefined) this.__variables["result"] = result;
			this.fireDataEvent("close", this.__variables["result"]);
		},

		// Model connection

		addConnection: function(target, targetPropertyPath, modelPropertyPath) {
			var connection = new qookery.internal.util.Connection(target, targetPropertyPath, modelPropertyPath);
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
		this._disposeArray("__disposeList");
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

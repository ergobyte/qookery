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
 * Base class for all Qookery components.
 */
qx.Class.define("qookery.internal.components.Component", {

	type: "abstract",
	extend: qx.core.Object,
	implement: [ qookery.IComponent ],

	statics: {

		__LAYOUT_ITEM_PROPERTY_MAP: {
			"col-span": "colSpan",
			"column": "column",
			"flex": "flex",
			"left": "left",
			"line-break": "lineBreak",
			"row": "row",
			"row-span": "rowSpan",
			"stretch": "stretch",
			"top": "top"
		}
	},

	properties: {
		enabled: { init: true, check: "Boolean", inheritable: true, apply: "_applyEnabled" },
		visibility: { init: "visible", check : [ "visible", "hidden", "excluded" ], inheritable: true, apply: "_applyVisibility" }
	},

	construct: function(parentComponent) {
		this.base(arguments);
		this.__parentComponent = parentComponent;
		this.__attributes = { };
		this.__actions = { };
		this._widgets = [ ];
	},

	members: {

		__parentComponent: null,
		__attributes: null,
		__actions: null,
		__namespaceResolver: null,
		__disposeList: null,

		_widgets: null,

		// Metadata

		getId: function() {
			return this.getAttribute(qookery.IComponent.A_ID);
		},

		getAttributeType: function(attributeName) {
			return qookery.internal.Registry.getInstance().getAttributeType(attributeName);
		},

		getAttribute: function(attributeName, defaultValue) {
			var attributes = this.__attributes;
			if(attributes == null)
				return defaultValue;
			var value = attributes[attributeName];
			if(value !== undefined)
				return value;
			if(defaultValue === Error)
				throw new RangeError(qx.lang.String.format("Required attribute '%1' missing from '%2'", [ attributeName, this ]));
			return defaultValue;
		},

		setAttribute: function(attributeName, value) {
			if(value === undefined)
				delete this.__attributes[attributeName];
			else
				this.__attributes[attributeName] = value;
		},

		// Namespaces

		resolveNamespacePrefix: function(prefix) {
			var namespaces = this.getAttribute(qookery.IComponent.A_NAMESPACES);
			if(namespaces != null) {
				var namespaceUri = namespaces[prefix];
				if(namespaceUri != null)
					return namespaceUri;
			}
			var parent = this.getParent();
			if(parent != null)
				return parent.resolveNamespacePrefix(prefix);
			return null;
		},

		resolveQName: function(qName) {
			var resolver = this.__namespaceResolver;
			if(resolver == null)
				resolver = this.__namespaceResolver = this.resolveNamespacePrefix.bind(this);
			return qookery.util.Xml.resolveQName(resolver, qName);
		},

		// Lifecycle

		create: function(attributes) {
			// Attention: If overriden, base must be called early in order to setup initial attributes
			for(var attributeName in attributes) {
				this.setAttribute(attributeName, attributes[attributeName]);
			}

			this._widgets = this._createWidgets();
			this._registerWithWidgets();

			this._applyAttribute("enabled", this, "enabled");
			this._applyAttribute("visibility", this, "visibility");
		},

		parseXmlElement: function(elementName, xmlElement) {
			// Override to implement custom elements
			return false;
		},

		setup: function() {
			// Nothing to do here, override if needed
		},

		// Access to other components

		getForm: function() {
			if(!this.__parentComponent) return null;
			return this.__parentComponent.getForm();
		},

		getParent: function() {
			return this.__parentComponent;
		},

		setAction: function(actionName, scriptFunction) {
			this.__actions[actionName] = scriptFunction;
		},

		listWidgets: function(filterName) {
			return this._widgets;
		},

		getMainWidget: function() {
			return this.listWidgets("main")[0];
		},

		isFocusable: function() {
			if(!this.isEnabled())
				return false;
			var widget = this.getMainWidget();
			if(widget == null)
				return false;
			if(widget.isDisposed())
				return false;
			if(!(widget instanceof qx.ui.core.Widget))
				return false;
			if(!widget.isFocusable())
				return false;
			return true;
		},

		focus: function() {
			var widget = this.getMainWidget();
			if(widget != null)
				widget.focus();
		},

		addEventHandler: function(eventName, handler, onlyOnce) {
			var receiver = null;
			if(qx.Class.supportsEvent(this.constructor, eventName)) {
				receiver = this;
			}
			else {
				var mainWidget = this.getMainWidget();
				if(mainWidget != null && qx.Class.supportsEvent(mainWidget.constructor, eventName))
					receiver = mainWidget;
			}
			if(!receiver)
				throw new Error(qx.lang.String.format("Event '%1' not supported", [ eventName ]));

			var methodName = onlyOnce ? "addListenerOnce" : "addListener";
			receiver[methodName](eventName, handler, this);
		},

		executeAction: function(actionName, varargs) {
			var actionFunction = this.__actions[actionName];
			if(actionFunction == null) return null;
			var actionArguments = Array.prototype.slice.call(arguments, 1);
			return actionFunction.apply(this, actionArguments);
		},

		evaluateExpression: function(expression) {
			return this.executeClientCode("return (" + expression + ");", null);
		},

		executeClientCode: function(clientCode, argumentMap) {
			var clientCodeContext = this.getForm().getScriptingContext();
			try {
				argumentMap = argumentMap || { };
				var keys = Object.keys(argumentMap);
				var values = qx.lang.Object.getValues(argumentMap);
				qx.lang.Array.insertAt(keys, "$", 0);
				qx.lang.Array.insertAt(values, clientCodeContext, 0);
				var clientFunction = new Function(keys, clientCode);
				return clientFunction.apply(this, values);
			}
			catch(error) {
				qookery.util.Debug.logScriptError(this, clientCode, error);
				throw error;
			}
		},

		isActionSupported: function(actionName) {
			return this.__actions[actionName] !== undefined;
		},

		validate: function() {
			// Override to implement component validation
			return null;
		},

		tr: function(messageId, varArgs) {
			if(!messageId) return null;
			var manager = qx.locale.Manager;
			if(!manager) return messageId;
			if(messageId.charAt(0) === ".")
				messageId = (this.getForm().getTranslationPrefix() || "") + messageId;
			else if(messageId.charAt(0) === "$")
				messageId = this.classname + messageId;
			var formatArguments = qx.lang.Array.fromArguments(arguments, 1);
			return qx.locale.Manager.getInstance().translate(messageId, formatArguments);
		},

		addToDisposeList: function(disposable) {
			if(!this.__disposeList) this.__disposeList = [ ];
			this.__disposeList.push(disposable);
		},

		toString: function() {
			var hash = this.getId() || this.$$hash;
			var form = this.getForm();
			if(form != null && form.getId() != null)
				hash = form.getId() + "#" + hash;
			return this.classname + "[" + hash + "]";
		},

		// Protected methods for internal use

		_createWidgets: function() {
			// Subclasses are advised to implement this method instead of overriding create()
			return this._widgets;
		},

		/**
		 * Add component information to its widgets
		 */
		_registerWithWidgets: function() {
			if(this._widgets.length === 0)
				throw new Error("Component failed to create at least one widget");

			for(var i = 0; i < this._widgets.length; i++)
				this._widgets[i].setUserData("qookeryComponent", this);

			var componentId = this.getId();
			if(componentId != null)
				this.getMainWidget().getContentElement().setAttribute("qkid", componentId);
		},

		_applyAttribute: function(attributeName, target, propertyName, defaultValue) {
			var value = this.getAttribute(attributeName, defaultValue);
			if(value === undefined)
				return false;
			if(qx.lang.Type.isFunction(propertyName)) {
				propertyName.call(target, value);
				return true;
			}
			if(propertyName == null) {
				propertyName = attributeName.replace(/-([a-z])/g, function(g) { return g[1].toUpperCase(); });
			}
			target.set(propertyName, value);
			return true;
		},

		/**
		 * Apply common attributes to a widget
		 *
		 * @param widget {qx.ui.core.Widget} widget to receive layout properties
		 */
		_applyWidgetAttributes: function(widget) {

			// Size and position

			this._applyAttribute("width", widget, "width");
			this._applyAttribute("height", widget, "height");
			this._applyAttribute("min-width", widget, "minWidth");
			this._applyAttribute("min-height", widget, "minHeight");
			this._applyAttribute("max-width", widget, "maxWidth");
			this._applyAttribute("max-height", widget, "maxHeight");

			this._applyAttribute("align-x", widget, "alignX");
			this._applyAttribute("align-y", widget, "alignY");

			this._applyAttribute("allow-grow", widget, "allowGrowX");
			this._applyAttribute("allow-grow", widget, "allowGrowY");
			this._applyAttribute("allow-grow-x", widget, "allowGrowX");
			this._applyAttribute("allow-grow-y", widget, "allowGrowY");

			this._applyAttribute("allow-shrink", widget, "allowShrinkX");
			this._applyAttribute("allow-shrink", widget, "allowShrinkY");
			this._applyAttribute("allow-shrink-x", widget, "allowShrinkX");
			this._applyAttribute("allow-shrink-y", widget, "allowShrinkY");

			this._applyAttribute("allow-stretch", widget, "allowStretchX");
			this._applyAttribute("allow-stretch", widget, "allowStretchY");
			this._applyAttribute("allow-stretch-x", widget, "allowStretchX");
			this._applyAttribute("allow-stretch-y", widget, "allowStretchY");

			this._applyAttribute("margin", widget, "margin");
			this._applyAttribute("margin-top", widget, "marginTop");
			this._applyAttribute("margin-right", widget, "marginRight");
			this._applyAttribute("margin-bottom", widget, "marginBottom");
			this._applyAttribute("margin-left", widget, "marginLeft");

			this._applyAttribute("padding", widget, "padding");
			this._applyAttribute("padding-top", widget, "paddingTop");
			this._applyAttribute("padding-right", widget, "paddingRight");
			this._applyAttribute("padding-bottom", widget, "paddingBottom");
			this._applyAttribute("padding-left", widget, "paddingLeft");

			// Appearance

			this._applyAttribute("appearance", widget, "appearance");
			this._applyAttribute("cursor", widget, "cursor");
			this._applyAttribute("decorator", widget, "decorator");
			this._applyAttribute("font", widget, "font");
			this._applyAttribute("text-color", widget, "textColor");
			this._applyAttribute("background-color", widget, "backgroundColor");
			this._applyAttribute("tool-tip-text", widget, "toolTipText");
			this._applyAttribute("tool-tip-icon", widget, "toolTipIcon");

			// Miscellaneous

			this._applyAttribute("draggable", widget, "draggable");
			this._applyAttribute("droppable", widget, "droppable");
			this._applyAttribute("focusable", widget, "focusable");
			this._applyAttribute("tab-index", widget, "tabIndex");

			// Layout item properties

			var layoutProperties = null;
			var layoutPropertyMap = qookery.internal.components.Component.__LAYOUT_ITEM_PROPERTY_MAP;
			for(var attributeName in layoutPropertyMap) {
				var value = this.getAttribute(attributeName, undefined);
				if(value === undefined)
					continue;
				if(layoutProperties == null) layoutProperties = { };
				layoutProperties[layoutPropertyMap[attributeName]] = value;
			}
			if(layoutProperties != null)
				widget.setLayoutProperties(layoutProperties);
		},

		_applyEnabled: function(enabled) {
			var widgets = this.listWidgets();
			for(var i = 0; i < widgets.length; i++) {
				var widget = widgets[i];
				widget.setEnabled(enabled);
			}
		},

		_applyVisibility: function(visibility) {
			var widgets = this.listWidgets();
			for(var i = 0; i < widgets.length; i++) {
				var widget = widgets[i];
				widget.setVisibility(visibility);
			}
		}
	},

	destruct: function() {
		this._disposeArray("__disposeList");
		var widgets = this.listWidgets();
		for(var i = 0; i < widgets.length; i++) {
			var widget = widgets[i];
			if(widget == null) continue;
			widget.destroy();
		}
		delete this.__actions;
		this.__parentComponent = null;
		this.__attributes = null;
	}
});

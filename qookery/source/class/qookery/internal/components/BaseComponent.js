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
qx.Class.define("qookery.internal.components.BaseComponent", {

	type: "abstract",
	extend: qx.core.Object,
	implement: [ qookery.IComponent ],

	statics: {

		baseAttributeTypes: {
			"col-span": "Integer",
			"margin-bottom": "Integer",
			"margin-left": "Integer",
			"margin-right": "Integer",
			"margin-top": "Integer",
			"maximum": "Integer",
			"max-length": "Integer",
			"minimum": "Integer",
			"minimal-line-height": "Integer",
			"padding-bottom": "Integer",
			"padding-left": "Integer",
			"padding-right": "Integer",
			"padding-top": "Integer",
			"page-step": "Integer",
			"row-height": "Integer",
			"row-span": "Integer",
			"single-step": "Integer",
			"spacing": "Integer",
			"spacing-x": "Integer",
			"spacing-y": "Integer",
			"tab-index": "Integer",

			"allow-stretch": "Boolean",
			"allow-stretch-x": "Boolean",
			"allow-stretch-y": "Boolean",
			"auto-size": "Boolean",
			"focusable": "Boolean",
			"column-visibility-button-visible": "Boolean",
			"enabled": "Boolean",
			"live-update": "Boolean",
			"native-context-menu": "Boolean",
			"read-only": "Boolean",
			"required": "Boolean",
			"scale": "Boolean",
			"status-bar-visible": "Boolean",
			"tri-state": "Boolean",

			"width": "Size",
			"height": "Size",
			"min-width": "Size",
			"min-height": "Size",
			"max-width": "Size",
			"max-height": "Size",

			"margin": "IntegerList",
			"padding": "IntegerList",

			"filter": "RegularExpression",

			"label": "ReplaceableString",
			"placeholder": "ReplaceableString",
			"title": "ReplaceableString",
			"tool-tip-text": "ReplaceableString"
		}
	},

	properties: {
		enabled: { init: true, check: "Boolean", inheritable: true, apply: "_applyEnabled" },
		visibility: { init: "visible", check : [ "visible", "hidden", "excluded" ], inheritable: true, apply: "_applyVisibility" }
	},

	construct: function(parentComponent) {
		this.base(arguments);
		this.__parentComponent = parentComponent;
		this._widgets = [ ];
		this.__actions = { };
	},

	members: {

		__id: null,
		__parentComponent: null,
		__attributes: null,
		__actions: null,

		_widgets: null,

		// IComponent Implementation

		getId: function() {
			return this.__id;
		},

		getAttribute: function(attributeName, defaultValue) {
			var value = this.__attributes[attributeName];
			if(value !== undefined) return value;
			if(defaultValue === Error) throw new Error(qx.lang.String.format(
					"Required attribute '%1' missing for component '%2'", [ attributeName, this ]));
			return defaultValue;
		},

		setAttribute: function(attributeName, value) {
			throw new Error(qx.lang.String.format("Changing attribute '%1' is not supported", [ attributeName ]));
		},

		prepare: function(formParser, xmlElement) {
			// Nothing is done here by default, components may override
		},

		create: function(attributes) {
			// Attention: Base method must be called early when overriden
			this.__id = attributes["id"] || null;
			this.__attributes = attributes;

			this._widgets = this._createWidgets(attributes);
			this._registerWithWidgets();

			if(attributes["enabled"] !== undefined) this.setEnabled(attributes["enabled"]);
			if(attributes["visibility"] !== undefined) this.setVisibility(attributes["visibility"]);
		},

		parseCustomElement: function(formParser, xmlElement) {
			return false;
		},

		setup: function(formParser, attributes) {
			// Nothing to do here, override if needed
		},

		setAction: function(actionName, clientCode) {
			this.__actions[actionName] = clientCode;
		},

		listWidgets: function(filterName) {
			return this._widgets;
		},

		getMainWidget: function() {
			return this.listWidgets("main")[0];
		},

		getParent: function() {
			return this.__parentComponent;
		},

		getForm: function() {
			if(!this.__parentComponent) return null;
			return this.__parentComponent.getForm();
		},

		focus: function() {
			this.getMainWidget().focus();
		},

		addEventHandler: function(eventName, handlerArg, onlyOnce) {
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

			var handler = this._resolveHandlerArg(handlerArg);
			var methodName = onlyOnce ? "addListenerOnce" : "addListener";
			receiver[methodName](eventName, handler, this);
		},

		executeClientCode: function(clientCode, argumentMap) {
			var clientCodeContext = this.getForm().getClientCodeContext();
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
				if(error instanceof qx.core.AssertionError) throw error;
				this.error("Error executing client code\n\n", clientCode, "\n\n", error);
			}
		},

		executeAction: function(actionName, argumentMap) {
			var clientCode = this.__actions[actionName];
			if(!clientCode) return null;
			return this.executeClientCode(clientCode, argumentMap);
		},

		isActionSupported: function(actionName) {
			return this.__actions[actionName] !== undefined;
		},

		getAttributeType: function(attributeName) {
			return qookery.internal.components.BaseComponent.baseAttributeTypes[attributeName];
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

		toString: function() {
			return this.classname + "[" + (this.__id || this.$$hash) + "]";
		},

		// Protected methods for internal use

		_createWidgets: function(attributes) {
			// Subclasses are advised to implement this method instead of overriding create()
			return this._widgets;
		},

		/**
		 * Add component information to its widgets
		 */
		_registerWithWidgets: function() {
			if(this._widgets.length == 0)
				throw new Error("Component failed to create at least one widget");

			for(var i = 0; i < this._widgets.length; i++)
				this._widgets[i].setUserData("qookeryComponent", this);

			if(this.getId())
				this.getMainWidget().getContentElement().setAttribute("qkid", this.getId());
		},

		/**
		 * Apply common attributes to a widget
		 *
		 * @param widget {qx.ui.core.Widget} widget to receive layout properties
		 * @param attributes {Object} layouting instructions as provided by the XML parser
		 */
		_applyLayoutAttributes: function(widget, attributes) {

			// Layout

			if(undefined !== attributes["row-span"]) widget.setLayoutProperties({ rowSpan: attributes["row-span"] });
			if(undefined !== attributes["col-span"]) widget.setLayoutProperties({ colSpan: attributes["col-span"] });

			// Size and position

			if(undefined !== attributes["width"]) widget.setWidth(attributes["width"]);
			if(undefined !== attributes["height"]) widget.setHeight(attributes["height"]);
			if(undefined !== attributes["min-width"]) widget.setMinWidth(attributes["min-width"]);
			if(undefined !== attributes["min-height"]) widget.setMinHeight(attributes["min-height"]);
			if(undefined !== attributes["max-width"]) widget.setMaxWidth(attributes["max-width"]);
			if(undefined !== attributes["max-height"]) widget.setMaxHeight(attributes["max-height"]);

			if(undefined !== attributes["align-x"]) widget.setAlignX(attributes["align-x"]);
			if(undefined !== attributes["align-y"]) widget.setAlignY(attributes["align-y"]);

			if(undefined !== attributes["allow-stretch"]) { var v = attributes["allow-stretch"]; widget.setAllowStretchX(v); widget.setAllowStretchY(v); }
			if(undefined !== attributes["allow-stretch-x"]) widget.setAllowStretchX(attributes["allow-stretch-x"]);
			if(undefined !== attributes["allow-stretch-y"]) widget.setAllowStretchY(attributes["allow-stretch-y"]);

			if(undefined !== attributes["margin"]) widget.setMargin(attributes["margin"]);
			if(undefined !== attributes["margin-top"]) widget.setMarginTop(attributes["margin-top"]);
			if(undefined !== attributes["margin-right"]) widget.setMarginRight(attributes["margin-right"]);
			if(undefined !== attributes["margin-bottom"]) widget.setMarginBottom(attributes["margin-bottom"]);
			if(undefined !== attributes["margin-left"]) widget.setMarginLeft(attributes["margin-left"]);

			if(undefined !== attributes["padding"]) widget.setPadding(attributes["padding"]);
			if(undefined !== attributes["padding-top"]) widget.setPaddingTop(attributes["padding-top"]);
			if(undefined !== attributes["padding-right"]) widget.setPaddingRight(attributes["padding-right"]);
			if(undefined !== attributes["padding-bottom"]) widget.setPaddingBottom(attributes["padding-bottom"]);
			if(undefined !== attributes["padding-left"]) widget.setPaddingLeft(attributes["padding-left"]);

			// Appearance

			if(undefined !== attributes["appearance"]) widget.setAppearance(attributes["appearance"]);
			if(undefined !== attributes["cursor"]) widget.setCursor(attributes["cursor"]);
			if(undefined !== attributes["decorator"]) widget.setDecorator(attributes["decorator"]);
			if(undefined !== attributes["font"]) widget.setFont(attributes["font"]);
			if(undefined !== attributes["text-color"]) widget.setTextColor(attributes["text-color"]);
			if(undefined !== attributes["background-color"]) widget.setBackgroundColor(attributes["background-color"]);
			if(undefined !== attributes["tool-tip-text"]) widget.setToolTipText(attributes["tool-tip-text"]);
			if(undefined !== attributes["tool-tip-icon"]) widget.setToolTipIcon(attributes["tool-tip-icon"]);

			// Miscellaneous

			if(undefined !== attributes["tab-index"]) widget.setTabIndex(attributes["tab-index"]);
			if(undefined !== attributes["focusable"]) widget.setFocusable(attributes["focusable"]);
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
		},

		_resolveHandlerArg: function(handlerArg) {
			if(qx.lang.Type.isFunction(handlerArg)) {
				return handlerArg;
			}
			if(qx.lang.Type.isString(handlerArg)) {
				return function(event) {
					this.executeClientCode(handlerArg, { "event": event });
				};
			}
			throw new Error("Unsupported handler type");
		}
	},

	destruct: function() {
		var widgets = this.listWidgets();
		for(var i = 0; i < widgets.length; i++) {
			widgets[i].destroy();
		}
		delete this.__actions;
		this.__parentComponent = null;
		this.__attributes = null;
	}
});

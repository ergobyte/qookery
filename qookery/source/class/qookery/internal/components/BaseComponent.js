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
 * Base class for all Qookery components.
 */
qx.Class.define("qookery.internal.components.BaseComponent", {

	type : "abstract",
	extend: qx.core.Object,
	implement: [ qookery.IComponent ],

	statics: {

		baseAttributeTypes: {
			"column-span": "Integer",
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

			"auto-size": "Boolean",
			"center": "Boolean",
			"column-visibility-button-visible": "Boolean",
			"enabled": "Boolean",
			"live-update": "Boolean",
			"read-only": "Boolean",
			"required": "Boolean",
			"rich": "Boolean",
			"scale": "Boolean",
			"status-bar-visible": "Boolean",
			"stretch": "Boolean",
			"stretch-x": "Boolean",
			"stretch-y": "Boolean",
			"tri-state": "Boolean",
			"wrap": "Boolean",

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
			"null-item-label": "ReplaceableString",
			"placeholder": "ReplaceableString",
			"title": "ReplaceableString",
			"tooltip-text": "ReplaceableString",

			"connect": "QName"
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
		_widgets: null,
		__actions: null,

		// Implementations

		prepare: function(formParser, xmlElement) {
			// Nothing is done here by default, components may override
		},

		create: function(attributes) {
			this.__id = attributes['id'];
			this.__attributes = attributes;

			if(this._widgets.length == 0)
				throw new Error("Component failed to create at least one widget");

			for(var i = 0; i < this._widgets.length; i++)
				this._widgets[i].setUserData('qookeryComponent', this);

			if(attributes['enabled'] !== undefined) this.setEnabled(false);
			if(attributes['visibility']) this.setVisibility(attributes['visibility']);
		},

		parseCustomElement: function(formParser, xmlElement) {
			return false;
		},

		setup: function(attributes) {
			// Nothing to do here, override if needed
		},

		setAction: function(actionName, clientCode) {
			this.__actions[actionName] = clientCode;
		},

		getId: function() {
			return this.__id;
		},

		getAttribute: function(attributeName) {
			return this.__attributes[attributeName];
		},

		listWidgets: function(filterName) {
			return this._widgets;
		},

		getMainWidget: function() {
			return this.listWidgets('main')[0];
		},

		initialize: function(initOptions) {
			// Subclasses that require additional initialization
			// should override this method
		},

		getParent: function() {
			return this.__parentComponent;
		},

		getForm: function() {
			if(this.__parentComponent == null) return null;
			return this.__parentComponent.getForm();
		},

		focus: function() {
			this.getMainWidget().focus();
		},

		/**
		 * Add an event handler to this component
		 *
		 * @param {String} eventName The name of the event to listen to
		 * @param {String} clientCode The JavaScript source code to execute when the event is triggered
		 */
		addEventHandler: function(eventName, clientCode) {
			if(qx.Class.supportsEvent(this.constructor, eventName)) {
				this.addListener(eventName, function(event) {
					this.executeClientCode(clientCode, { "event": event });
				}, this);
				return;
			}
			var mainWidget = this.getMainWidget();
			if(mainWidget != null && qx.Class.supportsEvent(mainWidget.constructor, eventName)) {
				mainWidget.addListener(eventName, function(event) {
					this.executeClientCode(clientCode, { "event": event });
				}, this);
				return;
			}
			throw new Error(qx.lang.String.format("Event '%1' not supported", [ eventName ]));
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
				qx.log.Logger.error(this, qx.lang.String.format(
						"Error executing client code: %1\n\n%2", [ error, clientCode ]));
			}
		},

		executeAction: function(actionName, argumentMap) {
			var clientCode = this.__actions[actionName];
			if(!clientCode) return null;
			return this.executeClientCode(clientCode, argumentMap);
		},

		// Private methods for internal use

		/**
		 * Apply layout properties to a widget
		 *
		 * @param widget {qx.ui.core.Widget} Widget to receive layout properties
		 * @param attributes {Object} Layouting instructions as provided by the XML parser
		 */
		_applyLayoutAttributes: function(widget, attributes) {
			// Layout
			if(attributes['row-span']) widget.setLayoutProperties({ rowSpan: attributes['row-span'] });
			if(attributes['column-span']) widget.setLayoutProperties({ colSpan: attributes['column-span'] });
			// Size and position
			if(attributes['width']) widget.setWidth(attributes['width']);
			if(attributes['height']) widget.setHeight(attributes['height']);
			if(attributes['min-width']) widget.setMinWidth(attributes['min-width']);
			if(attributes['min-height']) widget.setMinHeight(attributes['min-height']);
			if(attributes['max-width']) widget.setMaxWidth(attributes['max-width']);
			if(attributes['max-height']) widget.setMaxHeight(attributes['max-height']);
			if(attributes['alignment-x']) widget.setAlignX(attributes['alignment-x']);
			if(attributes['alignment-y']) widget.setAlignY(attributes['alignment-y']);
			var stretchX = attributes['stretch-x'] !== undefined ? attributes['stretch-x'] : attributes['stretch'];
			var stretchY = attributes['stretch-y'] !== undefined ? attributes['stretch-y'] : attributes['stretch'];
			if(stretchX !== undefined) widget.setAllowStretchX(stretchX);
			if(stretchY !== undefined) widget.setAllowStretchY(stretchY);
			if(attributes['margin']) widget.setMargin(attributes['margin']);
			if(attributes['margin-top']) widget.setMarginTop(attributes['margin-top']);
			if(attributes['margin-right']) widget.setMarginRight(attributes['margin-right']);
			if(attributes['margin-bottom']) widget.setMarginBottom(attributes['margin-bottom']);
			if(attributes['margin-left']) widget.setMarginLeft(attributes['margin-left']);
			if(attributes['padding']) widget.setPadding(attributes['padding']);
			if(attributes['padding-top']) widget.setPaddingTop(attributes['padding-top']);
			if(attributes['padding-right']) widget.setPaddingRight(attributes['padding-right']);
			if(attributes['padding-bottom']) widget.setPaddingBottom(attributes['padding-bottom']);
			if(attributes['padding-left']) widget.setPaddingLeft(attributes['padding-left']);
			// Appearance
			if(attributes['appearance']) widget.setAppearance(attributes['appearance']);
			if(attributes['decorator']) widget.setDecorator(attributes['decorator']);
			if(attributes['font']) widget.setFont(attributes['font']);
			if(attributes['text-color']) widget.setTextColor(attributes['text-color']);
			if(attributes['background-color']) widget.setBackgroundColor(attributes['background-color']);
			if(attributes['tooltip-text']) widget.setToolTipText(attributes['tooltip-text']);
			if(attributes['tooltip-icon']) widget.setToolTipIcon(attributes['tooltip-icon']);
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

		getAttributeType: function(attributeName) {
			return qookery.internal.components.BaseComponent.baseAttributeTypes[attributeName];
		},

		tr: function(messageId, varArgs) {
			if(!messageId) return null;
			var manager = qx.locale.Manager;
			if(!manager) return messageId;
			if(messageId.charAt(0) == '.')
				messageId = (this.getForm().getTranslationPrefix() || "") + messageId;
			return manager.tr.apply(manager, arguments);
		}
	},

	destruct: function() {
		var widgets = this.listWidgets();
		for(var i = 0; i < widgets.length; i++) {
			widgets[i].destroy();
		}
		this.__parentComponent = null;
		this.__attributes = null;
	}
});

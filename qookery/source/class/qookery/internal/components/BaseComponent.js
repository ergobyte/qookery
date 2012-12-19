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

	properties: {
	    enabled: { init: true, check: "Boolean", inheritable: true, apply: "_applyEnabled" },
	    visible: { init: true, check: "Boolean", inheritable: true, apply: "_applyVisible" }
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
		__createOptions: null,
		_widgets: null,
		__actions: null,

		// Implementations

		/**
		 * Create Qooxdoo widget(s)
		 *
		 * @param createOptions {keyValuePairList} an object with any number of setup options
		 */
		create: function(createOptions) {
			this.__id = createOptions['id'];
			this.__createOptions = createOptions;

			if(this._widgets.length == 0)
				throw new Error("Component failed to create at least one widget");

			for(var i = 0; i < this._widgets.length; i++)
				this._widgets[i].setUserData('qookeryComponent', this);

			if(createOptions['enabled'] == false) this.setEnabled(false);
			if(createOptions['visible'] == false) this.setVisible(false);
		},

		setAction: function(actionName, clientCode) {
			this.__actions[actionName] = clientCode;
		},

		getId: function() {
			return this.__id;
		},

		getCreateOptions: function() {
			return this.__createOptions;
		},

		setup: function() {
			// Nothing to do here, override if needed
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
			throw new Error(qx.lang.String.format("Event '%1' not supported", eventName));
		},

		executeClientCode: function(clientCode, argumentMap) {
			try {
				argumentMap = argumentMap || { };
				var keys = Object.keys(argumentMap);
				var values = qx.lang.Object.getValues(argumentMap);
				qx.lang.Array.insertAt(keys, "$", 0);
				qx.lang.Array.insertAt(values, this.getForm().getClientCodeContext(), 0);
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
		 * @param createOptions {Object} Layouting instructions as provided by the XML parser
		 */
		_applyLayoutProperties: function(widget, createOptions) {
			// Layout
			if(createOptions['row-span']) widget.setLayoutProperties({ rowSpan: createOptions['row-span'] });
			if(createOptions['column-span']) widget.setLayoutProperties({ colSpan: createOptions['column-span'] });
			// Size and position
			if(createOptions['width']) widget.setWidth(createOptions['width']);
			if(createOptions['height']) widget.setHeight(createOptions['height']);
			if(createOptions['min-width']) widget.setMinWidth(createOptions['min-width']);
			if(createOptions['min-height']) widget.setMinHeight(createOptions['min-height']);
			if(createOptions['max-width']) widget.setMaxWidth(createOptions['max-width']);
			if(createOptions['max-height']) widget.setMaxHeight(createOptions['max-height']);
			if(createOptions['alignment-x']) widget.setAlignX(createOptions['alignment-x']);
			if(createOptions['alignment-y']) widget.setAlignY(createOptions['alignment-y']);
			var stretchX = createOptions['stretch-x'] !== undefined ? createOptions['stretch-x'] : createOptions['stretch'];
			var stretchY = createOptions['stretch-y'] !== undefined ? createOptions['stretch-y'] : createOptions['stretch'];
			if(stretchX !== undefined) widget.setAllowStretchX(stretchX);
			if(stretchY !== undefined) widget.setAllowStretchY(stretchY);
			if(createOptions['margin']) widget.setMargin(createOptions['margin']);
			if(createOptions['margin-top']) widget.setMarginTop(createOptions['margin-top']);
			if(createOptions['margin-right']) widget.setMarginRight(createOptions['margin-right']);
			if(createOptions['margin-bottom']) widget.setMarginBottom(createOptions['margin-bottom']);
			if(createOptions['margin-left']) widget.setMarginLeft(createOptions['margin-left']);
			if(createOptions['padding']) widget.setPadding(createOptions['padding']);
			if(createOptions['padding-top']) widget.setPaddingTop(createOptions['padding-top']);
			if(createOptions['padding-right']) widget.setPaddingRight(createOptions['padding-right']);
			if(createOptions['padding-bottom']) widget.setPaddingBottom(createOptions['padding-bottom']);
			if(createOptions['padding-left']) widget.setPaddingLeft(createOptions['padding-left']);
			// Appearance
			if(createOptions['appearance']) widget.setAppearance(createOptions['appearance']);
			if(createOptions['decorator']) widget.setDecorator(createOptions['decorator']);
			if(createOptions['font']) widget.setFont(createOptions['font']);
			if(createOptions['text-color']) widget.setTextColor(createOptions['text-color']);
			if(createOptions['background-color']) widget.setBackgroundColor(createOptions['background-color']);
		},

		_applyEnabled: function(enabled) {
			var widgets = this.listWidgets();
			for(var i = 0; i < widgets.length; i++) {
				var widget = widgets[i];
				widget.setEnabled(enabled);
			}
		},

		_applyVisible: function(visible) {
			var widgets = this.listWidgets();
			for(var i = 0; i < widgets.length; i++) {
				var widget = widgets[i];
				if(visible) widget.show(); else widget.hide();
			}
		},

		_translate: function(text) {
			if(text == null || text.length < 2) return text;
			if(text.charAt(0) != '%') return text;
			var messageId = text.substring(1);
			return this['tr'](messageId);
		},

		tr: function(messageId) {
			var translationManager = qx.locale.Manager;
			if(!translationManager) return messageId;
			if(messageId != null && messageId.charAt(0) == '.')
				messageId = (this.getForm().getTranslationPrefix() || "") + messageId;
			return translationManager['tr'](messageId);
		}
	},

	destruct: function() {
		var widgets = this.listWidgets();
		for(var i = 0; i < widgets.length; i++) {
			widgets[i].destroy();
		}
		this.__parentComponent = null;
		this.__createOptions = null;
	}
});

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
 * @asset(qookery/lib/ace/*)
 *
 * @ignore(ace.*)
 */
qx.Class.define("qookery.ace.internal.AceComponent", {

	extend: qookery.internal.components.EditableComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {

		__editor: null,
		__ignoreChangeEvents: null,

		// Metadata

		getAttributeType: function(attributeName) {
			switch(attributeName) {
			case "h-scroll-bar-always-visible":
			case "highlight-active-line":
			case "show-gutter":
			case "use-soft-tabs":
			case "use-wrap-mode":
			case "v-scroll-bar-always-visible":
				return "Boolean";
			case "tab-size":
				return "Integer";
			default: return this.base(arguments, attributeName);
			}
		},

		// Construction

		_createMainWidget: function(attributes) {
			var widget = this.__createAceWidget();
			this._applyLayoutAttributes(widget, attributes);
			return widget;
		},

		// Public methods

		getEditor: function() {
			return this.__editor;
		},

		// Component implementation

		_updateUI: function(value) {
			if(!this.__editor) return;
			this.__ignoreChangeEvents = true;
			try {
				this.__editor.getSession().setValue(this.getValue());
			}
			finally {
				this.__ignoreChangeEvents = false;
			}
		},

		_applyValid: function(valid) {
			if(!valid) this.getMainWidget().addState("invalid"); else this.getMainWidget().removeState("invalid");
		},

		setInvalidMessage: function(invalidMessage) {
			// Overriden to block default implementation
		},

		focus: function() {
			this.__editor.focus();
		},

		// Internal

		__createAceWidget: function() {
			var aceWidget = new qookery.ace.internal.AceWidget();
			qookery.Qookery.getRegistry().loadLibrary("ace", function() {
				if(aceWidget.getContentElement().getDomElement()) {
					this.__attachAceEditor(aceWidget);
					return;
				}
				aceWidget.addListenerOnce("appear", function() {
					this.__attachAceEditor(aceWidget);
				}, this);
			}, this);
			return aceWidget;
		},

		__attachAceEditor: function(aceWidget) {
			var aceContainer = aceWidget.getContentElement().getDomElement();

			var editor = this.__editor = ace.edit(aceContainer);
			editor.setReadOnly(this.isReadOnly());
			editor.setHighlightActiveLine(this.getAttribute("highlight-active-line", true));
			editor.on("change", this.__onChange.bind(this));

			var renderer = editor.renderer;
			renderer.setShowGutter(this.getAttribute("show-gutter", true));
			renderer.setHScrollBarAlwaysVisible(this.getAttribute("h-scroll-bar-always-visible", false));
			renderer.setVScrollBarAlwaysVisible(this.getAttribute("v-scroll-bar-always-visible", false));

			var session = editor.getSession();
			session.setMode("ace/mode/" + this.getAttribute("mode"));
			session.setTabSize(this.getAttribute("tab-size", 4));
			session.setUseSoftTabs(this.getAttribute("use-soft-tabs", false));
			session.setUseWrapMode(this.getAttribute("use-wrap-mode", false));

			this._updateUI(this.getValue());
			editor.selection.moveCursorFileStart();
			renderer.scrollToX(0);
			renderer.scrollToY(0);

			this.executeAction("initializeEditor", { editor: editor });
		},

		__onChange: function(event) {
			if(this.__ignoreChangeEvents) return;
			var text = this.__editor.getSession().getValue();
			this._setValueSilently(text);
		}
	},

	destruct: function() {
		this.__editor = null;
	}
});

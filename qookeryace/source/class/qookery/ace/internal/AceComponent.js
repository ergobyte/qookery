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
			case "display-indent-guides":
			case "h-scroll-bar-always-visible":
			case "highlight-active-line":
			case "show-fold-widgets":
			case "show-invisibles":
			case "show-line-numbers":
			case "show-gutter":
			case "show-print-margin":
			case "use-soft-tabs":
			case "use-wrap-mode":
			case "v-scroll-bar-always-visible":
				return "Boolean";
			case "print-margin-column":
			case "tab-size":
				return "Integer";
			case "cursor-style":
			case "theme":
				return "String";
			default: return this.base(arguments, attributeName);
			}
		},

		setAttribute: function(attributeName, value) {
			if(this.__editor != null) {
				switch(attributeName) {
				case "mode":
					this.__editor.getSession().setMode("ace/mode/" + value);
					break;
				}
			}
			return this.base(arguments, attributeName, value);
		},

		// Construction

		_createMainWidget: function() {
			var widget = new qookery.ace.internal.AceWidget(this);
			this._applyWidgetAttributes(widget);
			return widget;
		},

		setup: function() {
			qookery.Qookery.getRegistry().loadLibrary("ace", function(error) {
				if(error != null) {
					this.error("Error loading library", error);
					return;
				}
				var aceWidget = this.getMainWidget();
				if(aceWidget.getContentElement().getDomElement()) {
					this.__attachAceEditor(aceWidget);
					return;
				}
				aceWidget.addListenerOnce("appear", function() {
					this.__attachAceEditor(aceWidget);
				}, this);
			}, this);
			this.base(arguments);
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
				var value = this.getValue();
				if(value == null) value = "";
				this.__editor.getSession().setValue(value);
			}
			catch(e) {
				this.error("Error seting value of ACE editor", e);
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

		__attachAceEditor: function(aceWidget) {
			var aceContainer = aceWidget.getContentElement().getDomElement();

			var editor = this.__editor = ace.edit(aceContainer);
			editor.setReadOnly(this.isReadOnly());
			editor.setHighlightActiveLine(this.getAttribute("highlight-active-line", true));
			editor.setShowFoldWidgets(this.getAttribute("show-fold-widgets", true));
			editor.setShowInvisibles(this.getAttribute("show-invisibles", false));
			editor.setShowPrintMargin(this.getAttribute("show-print-margin", true));
			editor.setOption("cursorStyle", this.getAttribute("cursor-style", "ace"));
			editor.$blockScrolling = Infinity;
			editor.on("change", this.__onChange.bind(this));

			var renderer = editor.renderer;
			renderer.setPrintMarginColumn(this.getAttribute("print-margin-column", 80));
			renderer.setDisplayIndentGuides(this.getAttribute("display-indent-guides", true));
			renderer.setShowGutter(this.getAttribute("show-gutter", true));
			renderer.setHScrollBarAlwaysVisible(this.getAttribute("h-scroll-bar-always-visible", false));
			renderer.setVScrollBarAlwaysVisible(this.getAttribute("v-scroll-bar-always-visible", false));
			renderer.setOption("showLineNumbers", this.getAttribute("show-line-numbers", true));
			renderer.setTheme("ace/theme/" + this.getAttribute("theme", "textmate"));

			var session = editor.getSession();
			session.setMode("ace/mode/" + this.getAttribute("mode", "plain_text"));
			session.setTabSize(this.getAttribute("tab-size", 4));
			session.setUseSoftTabs(this.getAttribute("use-soft-tabs", true));
			session.setUseWrapMode(this.getAttribute("use-wrap-mode", false));

			this._updateUI(this.getValue());
			editor.selection.moveCursorFileStart();
			renderer.scrollToX(0);
			renderer.scrollToY(0);

			this.executeAction("initializeEditor", editor);
		},

		__onChange: function(event) {
			if(this.__ignoreChangeEvents) return;
			var value = this.__editor.getSession().getValue();
			if(value === "") value = null;
			this._setValueSilently(value);
		}
	},

	destruct: function() {
		this.__editor = null;
	}
});

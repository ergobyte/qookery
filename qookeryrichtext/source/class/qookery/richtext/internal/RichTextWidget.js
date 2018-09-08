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
 * @asset(qookery/lib/ckeditor/*)
 *
 * @ignore(CKEDITOR)
 * @ignore(CKEDITOR.*)
 */
qx.Class.define("qookery.richtext.internal.RichTextWidget", {

	extend: qx.ui.core.Widget,

	properties: {
		appearance: { refine: true, init: "textfield" },
		focusable: { refine: true, init: true },
		selectable: { refine: true, init: true },
		readOnly: { nullable: false, init: false, apply: "__applyReadOnly" },
		value: { nullable: true, check: "String", event: "changeValue", apply: "__setCkEditorText" }
	},

	construct: function(configuration) {
		this.base(arguments);
		this.__configuration = configuration;
		// Defer creation of CKEditor until after positioning is done
		this.addListenerOnce("appear", function(event) {
			qookery.Qookery.getRegistry().loadLibrary("ckeditor", this.__onLibraryLoaded, this);
		}, this);
		this.addListener("focusin", function() {
			if(this.__ckEditor == null) return;
			this.__ckEditor.focus();
		}, this);
	},

	members: {

		__configuration: null,
		__ckEditor: null,
		__disableValueUpdate: false,

		getCkEditor: function() {
			return this.__ckEditor;
		},

		_createContentElement: function() {
			// Create a selectable and overflow enabled <div> for CKEDITOR.inline()
			var element = new qx.html.Element("div", {
				overflowX: "auto",
				overflowY: "auto"
			});
			element.addClass("qk-rich-text");
			element.setSelectable(true);
			return element;
		},

		__onLibraryLoaded: function(error) {
			if(error != null) {
				this.error("Error loading library", error);
				return;
			}
			// Method might be called after widget destruction
			if(this.isDisposed()) return;

			// Horrific kludge to prevent qx.ui.root.Abstract#__preventScrollWhenFocused() from eating up Space keypresses
			var element = this.getContentElement();
			element.getNodeName = function() {
				return "textarea";
			};

			// Check that CKEditor is in a supported environment
			var domElement = element.getDomElement();
			if(!CKEDITOR.env.isCompatible) {
				domElement.innerHTML = "<span style='color: red;'>Rich text editing is not supported in this environment. Please upgrade your browser.</span>";
				return;
			}

			// Invoke CKEditor inline()
			domElement.setAttribute("contenteditable", "true");
			domElement.setAttribute("data-qk-widget", this.toHashCode());
			this.__ckEditor = CKEDITOR.inline(domElement, this.__configuration);
			// Defer further setup after instance is ready
			this.__ckEditor.on("instanceReady", function() {
				// Insert current value into newly created editor
				this.__setCkEditorText(this.getValue());
				// Register value change listener
				this.__ckEditor.on("change", this.__onCkEditorChange, this);
				this.__ckEditor.setReadOnly(this.getReadOnly());
			}, this);
			this.setFocusable(true);
		},

		__onCkEditorChange: function() {
			var text = this.__ckEditor.getData();
			// Couldn't figure out a way to prevent CKEditor from inserting spurious non-breaking spaces - removing manually
			text = text.replace(/(&nbsp;|\u00A0|\u202F)+/g, " ");
			if(text.trim().length === 0)
				text = null;
			this.__disableValueUpdate = true;
			try {
				this.setValue(text);
			}
			finally {
				this.__disableValueUpdate = false;
			}
		},

		__setCkEditorText: function(text) {
			// It is possible that we are not ready to accept values yet
			if(this.__ckEditor == null || this.__disableValueUpdate) return;
			// Store and set new value into CKEditor
			this.__ckEditor.setData(text);
		},

		__applyReadOnly: function(value) {
			var element = this.getContentElement();
			element.setAttribute("readOnly", value);
			if(this.__ckEditor != null)
				this.__ckEditor.setReadOnly(value);
			if(value) {
				this.addState("readonly");
				this.setFocusable(false);
			}
			else {
				this.removeState("readonly");
				this.setFocusable(true);
			}
		}
	},

	destruct: function() {
		// We have to behave ourselves and properly clean up our mess
		if(this.__ckEditor != null) {
			this.__ckEditor.destroy();
			this.__ckEditor = null;
		}
	}
});

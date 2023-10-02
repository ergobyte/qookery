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
 * @ignore(InlineEditor)
 * @ignore(InlineEditor.*)
 */
qx.Class.define("qookery.richtext.internal.RichTextWidget", {

	extend: qx.ui.core.Widget,

	properties: {
		appearance: { refine: true, init: "rich-text" },
		focusable: { refine: true, init: true },
		selectable: { refine: true, init: true },
		readOnly: { nullable: false, init: false, apply: "__applyReadOnly" },
		value: { nullable: true, check: "String", event: "changeValue", apply: "__setCkEditorText" }
	},

	construct: function(configuration) {
		this.base(arguments);
		qx.core.ObjectRegistry.register(this);
		this.__configuration = configuration;
		// Defer creation of CKEditor until after positioning is done
		this.addListenerOnce("appear", function(event) {
			qookery.Qookery.getRegistry().loadLibrary("ckeditor", this.__onLibraryLoaded, this);
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
			element.setSelectable(true);
			return element;
		},

		__onLibraryLoaded: function(error) {
			if(error != null) {
				this.error("Error loading library", error);
				return;
			}
			// Method might be called after widget destruction
			if(this.isDisposed())
				return;

			// Check that CKEditor is in a supported environment
			var element = this.getContentElement();
			var domElement = element.getDomElement();
			// Invoke CKEditor inline()
			domElement.setAttribute("data-qk-widget", this.toHashCode());
			InlineEditor
				.create(domElement, this.__configuration)
				.then(function(editor) {
					this.__ckEditor = editor;
					var value = this.getValue();
					if(value == null)
						value = "";
					// Insert current value into newly created editor
					this.__setCkEditorText(value);
					this.__ckEditor.model.document.on("change:data", this.__onCkEditorChange.bind(this));
					this.__applyReadOnlyMode(this.getReadOnly());
				}.bind(this))
				.catch(function(error) {
					this.error("Error creating editor", error);
				}.bind(this));
			this.setFocusable(true);
			this.addListener("resize", function(event) {
				if(!this.__ckEditor)
					return;
				this.__ckEditor.editing.view.change(function(writer) {
					writer.setStyle("width", event.getData().width + "px", this.__ckEditor.editing.view.document.getRoot());
					writer.setStyle("height", event.getData().height + "px", this.__ckEditor.editing.view.document.getRoot());
				}.bind(this));
			}, this);
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
			if(this.__ckEditor == null || this.__disableValueUpdate)
				return;
			// Store and set new value into CKEditor
			this.__ckEditor.setData(text);
		},

		__applyReadOnly: function(value) {
			var element = this.getContentElement();
			element.setAttribute("readOnly", value);
			this.__applyReadOnlyMode(value);
			if(value) {
				this.addState("readonly");
				this.setFocusable(false);
			}
			else {
				this.removeState("readonly");
				this.setFocusable(true);
			}
		},

		__applyReadOnlyMode: function(value) {
			if(this.__ckEditor == null)
				return;
			var myFeatureLockId = this.toHashCode();
			if(value)
				this.__ckEditor.enableReadOnlyMode(myFeatureLockId);
			else
				this.__ckEditor.disableReadOnlyMode(myFeatureLockId);
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

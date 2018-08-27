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

qx.Class.define("qookery.richtext.internal.RichTextComponent", {

	extend: qookery.internal.components.EditableComponent,

	statics: {
		DEFAULT_TOOLBAR: "Bold Italic Underline Strike - Subscript Superscript | " +
				"NumberedList BulletedList - Outdent Indent Blockquote | " +
				"JustifyLeft JustifyCenter JustifyRight JustifyBlock | " +
				"Cut Copy Paste PasteText | " +
				"Undo Redo - SelectAll RemoveFormat | " +
				"Link Unlink"
	},

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {

		getAttributeType: function(attributeName) {
			switch(attributeName) {
			case "title": return "Boolean";
			case "toolbar-can-collapse": return "Boolean";
			case "custom-config": return "String";
			default: return this.base(arguments, attributeName); }
		},

		create: function(attributes) {
			this.base(arguments, attributes);
		},

		_createMainWidget: function(attributes) {
			// Prepare CKEditor configuration
			var configuration = { };
			configuration["language"] = qx.locale.Manager.getInstance().getLanguage();
			configuration["readOnly"] = this.getReadOnly();
			configuration["tabIndex"] = attributes["tab-index"];
			configuration["title"] = this.getAttribute("title", false);
			configuration["toolbarCanCollapse"] = this.getAttribute("toolbar-can-collapse", false);
			configuration["uiColor"] = qx.theme.manager.Color.getInstance().resolve(this.getAttribute("ui-color", "background"));

			var removePluginsSpecification = this.getAttribute("remove-plugins");
			if(removePluginsSpecification)
				configuration["removePlugins"] = removePluginsSpecification.split(/\s+/).join(",");

			var customConfigName = this.getAttribute("custom-config", qookery.Qookery.getOption("q-richtext:default-custom-config", null));
			if(customConfigName != null) {
				var resourceLoader = qookery.Qookery.getService("qookery.IResourceLoader", true);
				var customConfigUri = resourceLoader.resolveResourceUri(customConfigName);
				configuration["customConfig"] = qx.util.Uri.getAbsolute(customConfigUri);
			}
			else {
				var toolbarSpecification = this.getAttribute("toolbar", qookery.richtext.internal.RichTextComponent.DEFAULT_TOOLBAR);
				if(toolbarSpecification) configuration["toolbar"] = toolbarSpecification.split(/\s*\|\s*/).reduce(function(a, s) {
					a.push(s.split(/\s+/)); return a;
				}, [ ]);
			}

			// Create the wrapping widget
			var widget = new qookery.richtext.internal.RichTextWidget(configuration);
			widget.addListener("changeValue", function(event) {
				if(this._disableValueEvents) return;
				this._setValueSilently(event.getData());
			}, this);
			if(attributes["tab-index"] !== undefined) widget.setTabIndex(attributes["tab-index"]);

			// Configure widget positioning by applying layout
			this._applyLayoutAttributes(widget, attributes);
			return widget;
		},

		_updateUI: function(value) {
			this.getMainWidget().setValue(this._getLabelOf(value));
		},

		_applyReadOnly: function(readOnly) {
			this.base(arguments, readOnly);
			this.getMainWidget().setReadOnly(readOnly);
		},

		_applyValid: function(valid) {
			if(!valid)
				this.getMainWidget().addState("invalid");
			else
				this.getMainWidget().removeState("invalid");
		},

		setInvalidMessage: function(invalidMessage) {
			// Overriden to block default implementation
		}
	}
});

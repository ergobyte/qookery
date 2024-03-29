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

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {

		getAttributeType: function(attributeName) {
			switch(attributeName) {
			case "title": return "Boolean";
			case "toolbar-can-collapse": return "Boolean";
			case "custom-config": return "String";
			default: return this.base(arguments, attributeName);
			}
		},

		_createMainWidget: function() {
			// Prepare CKEditor configuration
			var configuration = { };
			configuration["language"] = qx.locale.Manager.getInstance().getLanguage();
			configuration["readOnly"] = this.getReadOnly();
			configuration["tabIndex"] = this.getAttribute("tab-index");
			configuration["title"] = this.getAttribute("title", false);
			configuration["toolbarCanCollapse"] = this.getAttribute("toolbar-can-collapse", false);
			configuration["uiColor"] = qx.theme.manager.Color.getInstance().resolve(this.getAttribute("ui-color", "background"));

			var toolbarName = this.getAttribute("toolbar");
			if(toolbarName != null)
				configuration["toolbar"] = toolbarName;

			var removePluginsSpecification = this.getAttribute("remove-plugins");
			if(removePluginsSpecification)
				configuration["removePlugins"] = removePluginsSpecification.split(/\s+/).join(",");

			var customConfigName = this.getAttribute("custom-config", qookery.Qookery.getOption("q-richtext:default-custom-config", null));
			if(customConfigName != null) {
				var resourceLoader = qookery.Qookery.getService("qookery.IResourceLoader", true);
				var customConfigUri = resourceLoader.resolveResourceUri(customConfigName);
				configuration["customConfig"] = qx.util.Uri.getAbsolute(customConfigUri);
			}

			// Create the wrapping widget
			var widget = new qookery.richtext.internal.RichTextWidget(configuration);
			widget.addListener("changeValue", function(event) {
				if(this._disableValueEvents) return;
				this._setValueSilently(event.getData());
			}, this);
			this._applyAttribute("tab-index", widget, "tabIndex");

			// Configure widget positioning by applying layout
			this._applyWidgetAttributes(widget);
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

		getCkEditor: function() {
			return this.getMainWidget().getCkEditor();
		},

		setInvalidMessage: function(invalidMessage) {
			// Overriden to block default implementation
		}
	}
});

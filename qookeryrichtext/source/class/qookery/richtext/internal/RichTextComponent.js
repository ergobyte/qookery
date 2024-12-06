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

	events: {
		"wordCount": "qx.event.type.Data"
	},

	construct(parentComponent) {
		super(parentComponent);
	},

	members: {

		__widget: null,

		getAttributeType(attributeName) {
			switch(attributeName) {
			case "placeholder": return "Boolean";
			default: return super(attributeName);
			}
		},

		_createMainWidget() {
			// Prepare CKEditor configuration
			let configuration = { };
			configuration["language"] = qx.locale.Manager.getInstance().getLanguage();
			configuration["readOnly"] = this.getReadOnly();
			configuration["tabIndex"] = this.getAttribute("tab-index");
			configuration["placeholder"] = this.getAttribute("placeholder", "");

			let toolbarItems = this.getAttribute("toolbar");
			if(toolbarItems != null)
				configuration["toolbar"] = toolbarItems.split(/\s+/);

			let removePluginsSpecification = this.getAttribute("remove-plugins");
			if(removePluginsSpecification)
				configuration["removePlugins"] = removePluginsSpecification.split(/\s+/).join(",");

			configuration["wordCount"] = {
				onUpdate: function(stats) {
					this.fireDataEvent("wordCount", stats);
				}.bind(this)
			};

			// Create the wrapping widget
			let widget = this.__widget = new qookery.richtext.internal.RichTextWidget(configuration);
			widget.addListener("changeValue", event => {
				if(this._disableValueEvents)
					return;
				this._setValueSilently(event.getData());
			}, this);
			this._applyAttribute("tab-index", widget, "tabIndex");
			this._applyAttribute("native-context-menu", widget, "nativeContextMenu", true);

			// Configure widget positioning by applying layout
			this._applyWidgetAttributes(widget);
			return widget;
		},

		getMainWidget() {
			return this.__widget;
		},

		_updateUI(value) {
			this.__widget.setValue(this._getLabelOf(value));
		},

		_applyReadOnly(readOnly) {
			super(readOnly);
			this.__widget.setReadOnly(readOnly);
		},

		_applyEnabled(value) {
			super(value);
			this.__widget.setReadOnly(!value);
		},

		_applyValid(valid) {
			if(!valid)
				this.__widget.addState("invalid");
			else
				this.__widget.removeState("invalid");
		},

		getCkEditor() {
			return this.__widget.getCkEditor();
		},

		setInvalidMessage(invalidMessage) {
			// Overriden to block default implementation
		},

		_applyValidationErrors() {
			// Qookery validation is not supported
		}
	}
});

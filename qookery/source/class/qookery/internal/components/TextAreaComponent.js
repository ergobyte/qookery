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

qx.Class.define("qookery.internal.components.TextAreaComponent", {

	extend: qookery.internal.components.EditableComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	properties: {
		placeholder: { check: "String", inheritable: true, nullable: false, apply: "_applyPlaceholder" }
	},

	members: {

		// Metadata

		getAttributeType: function(attributeName) {
			switch(attributeName) {
			case "wrap": return "Boolean";
			}
			return this.base(arguments, attributeName);
		},

		// Construction

		create: function(attributes) {
			this.base(arguments, attributes);
			this._applyAttribute("placeholder", this, "placeholder");
		},

		_createMainWidget: function() {
			var widget = new qx.ui.form.TextArea();
			this._applyAttribute("native-context-menu", widget, "nativeContextMenu", qookery.Qookery.getOption(qookery.Qookery.OPTION_DEFAULT_NATIVE_CONTEXT_MENU));
			widget.addListener("changeValue", function(event) {
				if(this._disableValueEvents) return;
				var value = event.getData();
				if(value != null && value.trim().length === 0) value = null;
				this.getMainWidget().setValue(this._getLabelOf(value));
				this._setValueSilently(value);
			}, this);
			widget.addListener("keypress", function(event) {
				if(this.isReadOnly()) return;
				if(!event.isShiftPressed() || event.isAltPressed() || event.isCtrlPressed()) return;
				switch(event.getKeyIdentifier()) {
				case "Delete":
				case "Backspace":
					this.setValue(null);
					return;
				}
			}, this);
			this._applyWidgetAttributes(widget);
			this._applyAttribute("auto-size", widget, "autoSize");
			this._applyAttribute("filter", widget, "filter");
			this._applyAttribute("max-length", widget, "maxLength");
			this._applyAttribute("minimal-line-height", widget, "minimalLineHeight");
			this._applyAttribute("single-step", widget, "singleStep");
			this._applyAttribute("text-align", widget, "textAlign");
			this._applyAttribute("wrap", widget, "wrap");
			this._applyAttribute("live-update", widget, "liveUpdate", qookery.Qookery.getOption(qookery.Qookery.OPTION_DEFAULT_LIVE_UPDATE));
			return widget;
		},

		_updateUI: function(value) {
			this.getMainWidget().setValue(this._getLabelOf(value));
		},

		_applyPlaceholder: function(placeholder) {
			var mainWidget = this.getMainWidget();
			if(!mainWidget) return;
			mainWidget.setPlaceholder(placeholder);
		},

		_applyReadOnly: function(readOnly) {
			this.base(arguments, readOnly);
			var mainWidget = this.getMainWidget();
			if(!mainWidget) return;
			mainWidget.setReadOnly(readOnly);
		}
	}

});

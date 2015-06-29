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
			if(attributes["placeholder"]) this.setPlaceholder(attributes["placeholder"]);
		},

		_createMainWidget: function(attributes) {
			var widget = new qx.ui.form.TextArea();
			var nativeContextMenu = this.getAttribute("native-context-menu", qookery.Qookery.getOption(qookery.Qookery.OPTION_DEFAULT_NATIVE_CONTEXT_MENU));
			if(nativeContextMenu !== undefined) widget.setNativeContextMenu(nativeContextMenu);
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
			this._applyLayoutAttributes(widget, attributes);
			if(attributes["auto-size"] !== undefined) widget.setAutoSize(attributes["auto-size"]);
			if(attributes["filter"] !== undefined) widget.setFilter(attributes["filter"]);
			if(attributes["max-length"] !== undefined) widget.setMaxLength(attributes["max-length"]);
			if(attributes["minimal-line-height"] !== undefined) widget.setMinimalLineHeight(attributes["minimal-line-height"]);
			if(attributes["single-step"] !== undefined) widget.setSingleStep(attributes["single-step"]);
			if(attributes["text-align"] !== undefined) widget.setTextAlign(attributes["text-align"]);
			if(attributes["wrap"] !== undefined) widget.setWrap(attributes["wrap"]);

			var liveUpdate = this.getAttribute("live-update", qookery.Qookery.getOption(qookery.Qookery.OPTION_DEFAULT_LIVE_UPDATE, false));
			if(liveUpdate)
				widget.setLiveUpdate(true);

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
			var mainWidget = this.getMainWidget();
			if(!mainWidget) return;
			mainWidget.setReadOnly(readOnly);
		}
	}

});

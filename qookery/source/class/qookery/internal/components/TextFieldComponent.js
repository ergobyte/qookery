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

qx.Class.define("qookery.internal.components.TextFieldComponent", {

	extend: qookery.internal.components.EditableComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	properties: {
		placeholder: { check: "String", inheritable: true, nullable: false, apply: "_applyPlaceholder" }
	},

	members: {

		create: function(attributes) {
			this.base(arguments, attributes);
			if(attributes['placeholder']) this.setPlaceholder(attributes['placeholder']);
		},

		_createMainWidget: function(attributes) {
			var widget = new qx.ui.form.TextField();
			return this._setupTextField(widget, attributes);
		},

		_setupTextField: function(widget, attributes) {
			widget.addListener("changeValue", function(event) {
				if(this._disableValueEvents) return;
				var value = (event.getData().trim().length == 0) ? null : event.getData();
				this.setValue(value);
			}, this);
			this._applyLayoutAttributes(widget, attributes);
			if(attributes['text-align']) widget.setTextAlign(attributes['text-align']);
			if(attributes['filter']) widget.setFilter(attributes['filter']);
			if(attributes['max-length']) widget.setMaxLength(attributes['max-length']);
			if(attributes['live-update']) widget.setLiveUpdate(attributes['live-update']);
			return widget;
		},

		_applyPlaceholder: function(placeholder) {
			var mainWidget = this.getMainWidget();
			if(!mainWidget) return;
			mainWidget.setPlaceholder(placeholder);
		},

		_updateUI: function(value) {
			this.getMainWidget().setValue(this._getLabelOf(value));
		},

		_applyReadOnly: function(readOnly) {
			var mainWidget = this.getMainWidget();
			if(!mainWidget) return;
			mainWidget.setReadOnly(readOnly);
		}
	}
});

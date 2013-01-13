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

	$Id$
*/

qx.Class.define("qookery.internal.components.DateFieldComponent", {

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
			var widget = new qx.ui.form.DateField();
			widget.addListener("changeValue", function(event) {
				if(!event.getData())
					this.getMainWidget().resetValue();
				if(this._disableValueEvents) return;
				this.setValue(event.getData());
			}, this);
			this._applyLayoutAttributes(widget, attributes);
			return widget;
		},

		_updateUI: function(value) {
			var dateField = this.getMainWidget();
			if(!value) {
				dateField.resetValue();
				return;
			}
			if(!qx.lang.Type.isDate(value)) {
				if(qx.lang.Type.isString(value))
					value = new Date(Date.parse(value));
				else
					throw new Error("Unsupported value type");
			}
			dateField.setValue(value);
		},

		_applyPlaceholder: function(placeholder) {
			var mainWidget = this.getMainWidget();
			if(!mainWidget) return;
			mainWidget.setPlaceholder(placeholder);
		},

		_applyFormat: function(format) {
			this.getMainWidget().setDateFormat(format);
		}
	}
});

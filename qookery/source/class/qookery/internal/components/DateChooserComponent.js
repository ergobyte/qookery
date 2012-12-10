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

/**
 * A date chooser component that understand ISO 8601.
 * In the near feauture will be implemented more types of date.
 */
qx.Class.define("qookery.internal.components.DateChooserComponent", {

	extend: qookery.internal.components.EditableComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {

		_createMainWidget: function(createOptions) {
			var widget = new qx.ui.form.DateField();
			widget.addListener("changeValue", function(event) {
				if(this._disableValueEvents) return;
				this.setValue(event.getData());
			}, this);
			this._applyLayoutProperties(widget, createOptions);
			return widget;
		},

		_updateUI: function(value) {
			var dateField = this.getMainWidget();
			if(!value) {
				dateField.resetValue();
				return;
			}
			if(!qx.lang.Type.isDate(value)) {
				value = this.__convertFromString(value);
			}
			dateField.setValue(value);
		},

		_applyFormat: function(value) {
			this.base(arguments, value);
			this.getMainWidget().setDateFormat(this.getFormatter().getFormat());
		},

		__convertFromString: function(dateString) {
			var reggie = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/g;
			var dateArray = reggie.exec(dateString);
			var dateObject = new Date(
				(+dateArray[1]),
				(+dateArray[2])-1,//month starts with 0
				(+dateArray[3]),
				(+dateArray[4]),
				(+dateArray[5]),
				(+dateArray[6])
			);
			return dateObject;
		}
	}
});

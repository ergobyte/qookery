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

qx.Class.define("qookery.internal.components.DateFieldComponent", {

	extend: qookery.internal.components.EditableComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
		this.__regularExpression = /(\d{1,2})[\.\-\/\\\:](\d{1,2})([\.\-\/\\\:](\d?\d?\d\d))?/;
		this.__inputIndexMap = { year: 4, month: 2, date: 1, hours: 0, minutes: 0, seconds: 0 };
		this.__userTyped = false;
	},

	properties: {
		placeholder: { check: "String", inheritable: true, nullable: false, apply: "_applyPlaceholder" }
	},

	members: {

		__regularExpression: null,
		__inputIndexMap: null,
		__userTyped: null,

		create: function(attributes) {
			this.base(arguments, attributes);
			if(attributes['placeholder']) this.setPlaceholder(attributes['placeholder']);
			if(attributes['input-specification']) this.__parseSpecification(attributes['input-specification']);
		},

		_createMainWidget: function(attributes) {
			var widget = new qx.ui.form.DateField();
			widget.getChildControl("textfield").addListener("focusout", function(event) {
				if(this.__userTyped == true) {
					this.__userTyped = false;
					this.__parseInput();
				}
			}, this);
			widget.addListener("keypress", function(event) {
				this.__userTyped = true;
				if(event.getKeyIdentifier() != "Enter" && event.getKeyIdentifier() != "Tab") return;
				this.__parseInput();
				}, this);
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
			this.__userTyped = false;
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
		},

		__parseInput: function() {
			var textField = this.getMainWidget().getChildControl("textfield");
			var text = textField.getValue();
			if(!text || text == "") return;
			var res = this.__regularExpression.exec(text);
			if(!res) return;
			var year = res[this.__inputIndexMap.year];
			var month = res[this.__inputIndexMap.month] - 1;
			if(month < 1 || month > 12) return;
			var date = res[this.__inputIndexMap.date];
			if(date < 1 || date > 31) return;
			var hours = (parseInt(this.__inputIndexMap.hours, 10) != 0) ? res[this.__inputIndexMap.hours] : 0;
			if(hours < 0 || hours > 23) return;
			var minutes = (parseInt(this.__inputIndexMap.minutes, 10) != 0) ? res[this.__inputIndexMap.minutes] : 0;
			if(minutes < 0 || minutes > 59) return;
			var seconds = (parseInt(this.__inputIndexMap.seconds, 10) != 0) ? res[this.__inputIndexMap.seconds] : 0;
			if(seconds < 0 || seconds > 59) return;
			var inputDate = new Date(year, month, date, hours, minutes, seconds);
			this.setValue(inputDate);
		},

		__parseSpecification: function(specification) {
			var result = specification.split(' ', 7);
			if(!result || result.length != 7) return null;
			this.__inputIndexMap = {
				year: result[0],
				month: result[1],
				date: result[2],
				hours: result[3],
				minutes: result[4],
				seconds: result[5]
			};
			this.__regularExpression = new RegExp(result[6], 'i');
		}
	}
});

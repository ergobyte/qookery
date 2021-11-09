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

	members: {

		__regularExpression: null,
		__inputIndexMap: null,
		__userTyped: null,

		// Metadata

		getAttributeType: function(attributeName) {
			switch(attributeName) {
			case "placeholder": return "ReplaceableString";
			}
			return this.base(arguments, attributeName);
		},

		// Construction

		create: function(attributes) {
			this.base(arguments, attributes);
			this._applyAttribute("input-specification", this, function(specification) {
				this.__regularExpression = this.__parseSpecification(specification);
			});
		},

		_createMainWidget: function() {
			var widget = new qx.ui.form.DateField();
			this._applyAttribute("native-context-menu", widget, "nativeContextMenu", qookery.Qookery.getOption(qookery.Qookery.OPTION_DEFAULT_NATIVE_CONTEXT_MENU));
			widget.getChildControl("textfield").addListener("focusout", function(event) {
				if(this.__userTyped) {
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
			this._applyWidgetAttributes(widget);
			this._applyAttribute("placeholder", widget, "placeholder");
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

		_applyFormat: function(format) {
			this.getMainWidget().setDateFormat(format);
		},

		__parseInput: function() {
			var textField = this.getMainWidget().getChildControl("textfield");
			var text = textField.getValue();
			text = this.__parseDateTime(text);
			if(!text || text === "") return;
			var res = this.__regularExpression.exec(text);
			if(!res) return;
			var year = parseInt(res[this.__inputIndexMap.year], 10);
			var month = parseInt(res[this.__inputIndexMap.month], 10) - 1;
			if(month < 0 || month > 11) return;
			var date = parseInt(res[this.__inputIndexMap.date], 10);
			if(date < 1 || date > 31) return;
			var hours = (parseInt(this.__inputIndexMap.hours, 10) !== 0) ? parseInt(res[this.__inputIndexMap.hours], 10) : 0;
			if(hours < 0 || hours > 23) return;
			var minutes = (parseInt(this.__inputIndexMap.minutes, 10) !== 0) ? parseInt(res[this.__inputIndexMap.minutes], 10) : 0;
			if(minutes < 0 || minutes > 59) return;
			var seconds = (parseInt(this.__inputIndexMap.seconds, 10) !== 0) ? parseInt(res[this.__inputIndexMap.seconds], 10) : 0;
			if(seconds < 0 || seconds > 59) return;
			var inputDate = new Date(year, month, date, hours, minutes, seconds);
			this.setValue(inputDate);
		},

		__parseDateTime: function(string) {
			if(string == null) return "";
			var dateParts = string.split(/ +/);

			var datePart = "";
			var timePart = "00:00";

			//user give only time
			if(dateParts[0].indexOf(":") != -1) {
					datePart = qx.lang.String.format("%1/%2/%3", [new Date().getDate(), new Date().getMonth()+1, new Date().getFullYear()]);
					timePart = dateParts[0];
			}
			else {
				datePart = dateParts.length >= 1 ? this.__parseDate(dateParts[0]) : "";
				if(dateParts.length === 2 && parseInt(this.__inputIndexMap.minutes, 10) !== 0 && parseInt(this.__inputIndexMap.hours, 10) !== 0) {
					if(dateParts[1].indexOf(":") != -1) {
						timePart = dateParts[1];
					}
					else if(dateParts[1].indexOf(":") == -1 && dateParts[1]>0) {
						timePart = qx.lang.String.format("%1:%2", [dateParts[1], "00"]);
					}
				}
			}
			return qx.lang.String.format("%1 %2", [datePart, timePart]);
		},

		__parseDate: function(string) {
			var date = string.split("/");
			if(date.length == 1)
				date = string.split("-");

			switch(date.length) {
			case 1:
				string = qx.lang.String.format("01/%1/%2", [string, new Date().getFullYear()]);
				break;
			case 2:
				if(date[1].length == 4)
					string = qx.lang.String.format("01/%1/%2", [date[0], date[1]]);
				else
					string = qx.lang.String.format("%1/%2/%3", [date[0], date[1], new Date().getFullYear()]);
				break;
			case 3:
				if(date[2].length == 2) {
					date[2] = (parseInt(date[2], 10) < this.constructor.THRESHOLD ?
							(date[2].length == 1 ? "200" : "20") + date[2] : (date[2].length == 1 ? "190" : "19") + date[2]);
				}
				string = qx.lang.String.format("%1/%2/%3", [date[0], date[1], date[2]]);
				break;
			default:
				string = qx.lang.String.format("%1/%2/%3", [new Date().getDate(), new Date().getMonth()+1, new Date().getFullYear()]);
				break;
			}
			return string;
		},

		__parseSpecification: function(specification) {
			var result = specification.split(" ", 7);
			if(!result || result.length != 7) return null;
			this.__inputIndexMap = {
				year: result[0],
				month: result[1],
				date: result[2],
				hours: result[3],
				minutes: result[4],
				seconds: result[5]
			};
			return new RegExp(result[6], "i");
		}
	}
});

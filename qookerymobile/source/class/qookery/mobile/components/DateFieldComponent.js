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

qx.Class.define("qookery.mobile.components.DateFieldComponent", {

	extend: qookery.mobile.components.EditableComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {

		__textField: null,
		__updateValueCallback: null,

		// Construction

		create: function(attributes) {
			this.base(arguments, attributes);
			if(!this.getFormat()) {
				var defaultFormat = qookery.contexts.Qookery.createFormat("date", {
					format: qx.locale.Date.getDateFormat("short")
				});
				this.setFormat(defaultFormat);
			}
		},

		_createMainWidget: function(attributes) {
			var widget = this.__textField = new qx.ui.mobile.form.TextField();
			widget.addListener("changeValue", function(e) {
				if(this._disableValueEvents) return;
				if(this.__textField.getLiveUpdate()) {
					this._disposeObjects("__updateValueCallback");
					var timeoutId = qx.lang.Function.delay(this.__setValueFromTextField, 500, this);
					this.__updateValueCallback = {
						dispose: function() {
							window.clearTimeout(timeoutId);
						}
					};
					return;
				}
				this.__setValueFromTextField();
			}, this);
			this.__textField.setLiveUpdate(this.getAttribute("live-update", false));
			return widget;
		},

		// Component overrides

		_updateUI: function(value) {
			if(!value) {
				this.__textField.setValue(null);
				return;
			}
			var formattedDate = this.getFormat().format(value);
			this.__textField.setValue(formattedDate);
		},

		// Internals

		__setValueFromTextField: function() {
			var formattedDate = this.__textField.getValue();
			var format = this.getFormat();
			var date = format.parse(formattedDate);
			if(!date || isNaN(date.getTime())) date = null;
			if(this.__textField.isLiveUpdate()) this._setValueSilently(date);
			else this.setValue(date);
		}
	},

	destruct: function() {
		this._disposeObjects("__textField", "__updateValueCallback");
	}
});

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

qx.Class.define("qookery.mobile.components.TextFieldComponent", {

	extend: qookery.mobile.components.EditableComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {

		// Construction

		_createMainWidget: function(attributes) {
			var widget = new qx.ui.mobile.form.TextField();
			widget.addListener("changeValue", function(event) {
				if(this._disableValueEvents) return;
				var value = event.getData();
				if(value !== null && value.trim().length === 0) value = null;
				this.getMainWidget().setValue(this._getLabelOf(value));
				this._setValueSilently(value);
			}, this);
			return widget;
		},

		// Component overrides

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

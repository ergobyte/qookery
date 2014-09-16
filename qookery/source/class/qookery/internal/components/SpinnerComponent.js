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

qx.Class.define("qookery.internal.components.SpinnerComponent", {

	extend: qookery.internal.components.EditableComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {

		_createMainWidget: function(attributes) {
			var widget = new qx.ui.form.Spinner();
			this._applyLayoutAttributes(widget, attributes);
			widget.setMinimum(this.getAttribute("minimum", 0));
			widget.setMaximum(this.getAttribute("maximum", 100));
			widget.setPageStep(this.getAttribute("page-step", 10));
			widget.setSingleStep(this.getAttribute("single-step", 1));
			widget.addListener("changeValue", function(event) {
				if(this._disableValueEvents) return;
				this.setValue(event.getData());
			}, this);
			return widget;
		},

		_updateUI: function(value) {
			if(!value)
				this.getMainWidget().resetValue();
			else
				this.getMainWidget().setValue(parseInt(value, 10));
		},

		_applyFormat: function(format) {
			this.getMainWidget().setNumberFormat(format);
		}
	}
});

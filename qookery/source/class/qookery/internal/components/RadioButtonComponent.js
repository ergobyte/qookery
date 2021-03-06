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

qx.Class.define("qookery.internal.components.RadioButtonComponent", {

	extend: qookery.internal.components.ButtonComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {

		_createAtomWidget: function() {
			var radioButton = new qx.ui.form.RadioButton();
			this._applyAtomAttributes(radioButton);
			return radioButton;
		},

		setup: function() {
			var model = this.getAttribute("model");
			if(model != null) {
				var type = this.getAttribute("model-type", "String");
				this.setModel(qookery.util.Xml.parseValue(this, type, model));
			}
			return this.base(arguments);
		},

		getModel: function() {
			return this.getMainWidget().getModel();
		},

		setModel: function(model) {
			this.getMainWidget().setModel(model);
		}
	}
});

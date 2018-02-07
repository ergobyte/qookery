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

qx.Class.define("qookery.internal.components.ToggleButtonComponent", {

	extend: qookery.internal.components.AtomComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {

		// Metadata

		getAttributeType: function(attributeName) {
			switch(attributeName) {
			case "tri-state": return "Boolean";
			}
			return this.base(arguments, attributeName);
		},

		// Creation

		_createAtomWidget: function(attributes) {
			var toggleButton = new qx.ui.form.ToggleButton();
			this._applyAtomAttributes(toggleButton, attributes);
			if(attributes["tri-state"]) this.setTriState(attributes["tri-state"]);
			return toggleButton;
		},

		setup: function(formParser, attributes) {
			var model = attributes["model"];
			if(model != null) {
				var type = this.getAttribute("model-type", "String");
				this.setModel(formParser.parseValue(this, type, model));
			}
			return this.base(arguments, formParser, attributes);
		},

		getModel: function() {
			return this.getMainWidget().getModel();
		},

		setModel: function(model) {
			this.getMainWidget().setModel(model);
		},

		getValue: function() {
			return this.getMainWidget().getValue();
		},

		setValue: function(value) {
			this.getMainWidget().setValue(value);
		}
	},

	defer: function() {
		// TODO Patching a QX class goes against the "thin wrapper" spirit of Qookery- consider future removal
		qx.Class.patch(qx.ui.form.ToggleButton, qx.ui.form.MModelProperty);
		qx.Class.patch(qx.ui.form.ToggleButton, qx.ui.form.MForm);
	}
});

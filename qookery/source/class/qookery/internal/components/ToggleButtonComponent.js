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

		_createAtomWidget: function(attributes) {
			var toggleButton = new qx.ui.form.ToggleButton(attributes['label']);
			toggleButton.addListener("changeValue", function(event) {
				if(this._disableValueEvents) return;
				this.setValue(event.getData());
			}, this);
			this._applyAtomAttributes(toggleButton, attributes);
			if(attributes['model'] !== undefined) this.setModel(attributes['model']);
			if(attributes['tri-state'] !== undefined) this.setTriState(attributes['tri-state']);
			return toggleButton;
		},

		getModel: function() {
			return this.getMainWidget().getModel();
		},

		setModel: function(model) {
			this.getMainWidget().setModel(model);
		}
	}
});

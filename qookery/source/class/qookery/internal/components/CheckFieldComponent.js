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

qx.Class.define("qookery.internal.components.CheckFieldComponent", {

	extend: qookery.internal.components.EditableComponent,

	properties: {
		triState: { init: false, inheritable: true, check: "Boolean", nullable: true, apply: "__applyTriState" }
	},

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {

		// Metadata

		getAttributeType: function(attributeName) {
			switch(attributeName) {
			case "check-box-label": return "ReplaceableString";
			}
			return this.base(arguments, attributeName);
		},

		// Creation

		create: function(attributes) {
			this.base(arguments, attributes);
			if(attributes["tri-state"] !== undefined) this.setTriState(attributes["tri-state"]);
		},

		_createMainWidget: function(attributes) {
			var checkBox = new qx.ui.form.CheckBox();
			var label = this.getAttribute("check-box-label");
			if(label !== undefined)
				checkBox.setLabel(label);
			checkBox.addListener("changeValue", function(event) {
				if(this._disableValueEvents) return;
				this.setValue(event.getData());
			}, this);
			// Below hack works around chechbox shortcomings with triple state values
			if(attributes["tri-state"]) {
				checkBox.__availableStates = [ true, false, null ];
				checkBox.toggleValue = function () {
					this.__currentState = this.__availableStates.indexOf(this.getValue());
					this.__currentState = this.__currentState >= 2 ? 0 : this.__currentState + 1;
					this.setValue(this.__availableStates[this.__currentState]);
				}.bind(checkBox);
			}
			this._applyLayoutAttributes(checkBox, attributes);
			return checkBox;
		},

		// Component implementation

		_updateUI: function(value) {
			this.getMainWidget().setValue(value);
		},

		_applyReadOnly: function(readOnly) {
			this.getMainWidget().setEnabled(!readOnly);
		},

		// Internals

		__applyTriState: function(triState) {
			this.getMainWidget().setTriState(triState);
			this.getMainWidget().setValue(null);
		}
	}
});

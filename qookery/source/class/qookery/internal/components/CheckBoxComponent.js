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

qx.Class.define("qookery.internal.components.CheckBoxComponent", {

	extend: qookery.internal.components.EditableComponent,

	properties: {
		triState: { init: false, inheritable: true, check: "Boolean", nullable: true, apply: "_applyTriState" }
	},

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {

		create: function(attributes) {
			this.base(arguments, attributes);
			this.setTriState(attributes['tri-state']);
		},

		_createMainWidget: function(attributes) {
			var widget = new qx.ui.form.CheckBox(attributes['label']);
			widget.addListener("changeValue", function(event) {
				if(this._disableValueEvents) return;
				this.setValue(event.getData());
			}, this);
			attributes['label'] = "%none";
			
			//HACK Creating a real triple state check box
			if(attributes['tri-state']) {
				widget.__availableStates = [true, false, null];
				widget.toggleValue = function () {
					this.__currentState = this.__availableStates.indexOf(this.getValue());
					this.__currentState = this.__currentState >= 2 ? 0 : this.__currentState+1;
					this.setValue(this.__availableStates[this.__currentState]);
				}.bind(widget);
			}
			this._applyLayoutAttributes(widget, attributes);
			return widget;
		},

		_updateUI: function(value) {
			this.getMainWidget().setValue(value);
		},
		
		_applyTriState: function(triState) {
			this.getMainWidget().setTriState(triState);
			this.getMainWidget().setValue(null);
		}
	}
});

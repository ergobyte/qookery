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

	$Id$
*/

qx.Class.define("qookery.internal.components.ToggleButtonComponent", {

	extend: qookery.internal.components.EditableComponent,
	
	properties: {
		triState: { init: false, inheritable: true, check: "Boolean", nullable: true, apply: "_applyTriState" },
		model: { init: null, inheritable: true, nullable: true, apply: "_applyModel" }
	},
	
	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {
		
		_createMainWidget: function(attributes) {
			var label = attributes['label'];
			if(attributes['model']) this.setModel(attributes['model']);
			var widget = new qx.ui.form.ToggleButton(label);
			widget.addListener("changeValue", function(event) {
				if(this._disableValueEvents) return;
				this.setValue(event.getData());
			}, this);
			attributes['label'] = "%none";
			this._applyLayoutAttributes(widget, attributes);
			return widget;
		},

		_updateUI: function(value) {
			this.getMainWidget().setValue(value);
		},
		
		_applyTriState: function(triState) {
			this.getMainWidget().setTriState(triState);
		},
		
		_applyModel: function(model) {
			//
		}
	}
});

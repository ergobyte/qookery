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

qx.Class.define("qookery.internal.components.LabelComponent", {

	extend: qookery.internal.components.BaseComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {
		
		create: function(createOptions) {
			var labelText = this._translate(createOptions['label']) || "";
			this._widgets[0] = new qx.ui.basic.Label(labelText);
			if(createOptions['rich']) this._widgets[0].setRich(true);
			if(createOptions['wrap']) this._widgets[0].setWrap(true);
			this._applyLayoutProperties(this._widgets[0], createOptions);
			this.base(arguments, createOptions);
		},
		
		getValue: function() {
			return this.getMainWidget().getValue();
		},

		setValue: function(value) {
			this.getMainWidget().setValue(value);
		},
		
		getRich: function() {
			return this.getMainWidget().getRich();
		},

		setRich: function(value) {
			this.getMainWidget().setRich(value);
		}
	}
});

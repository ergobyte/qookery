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

qx.Class.define("qookery.internal.components.ButtonComponent", {

	extend: qookery.internal.components.AtomComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {

		_createAtomWidget: function(attributes) {
			var button = new qx.ui.form.Button();
			var commandName = this.getAttribute("command");
			if(commandName !== undefined) {
				var command = qookery.Qookery.getRegistry().getCommand(commandName);
				if(command === undefined) throw new Error("Undefined command " + commandName);
				button.setCommand(command);
			}
			this._applyAtomAttributes(button, attributes);
			return button;
		},

		setValue: function(buttonLabelValue) {
			// BCC Qookery: Method kept for compatibilty with former way of setting label
			this.getMainWidget().setLabel(buttonLabelValue);
		},

		getCommand: function() {
			return this.getMainWidget().getCommand();
		},

		setCommand: function(command) {
			this.getMainWidget().setCommand(command);
		},

		execute: function() {
			this.getMainWidget().execute();
		}
	}
});

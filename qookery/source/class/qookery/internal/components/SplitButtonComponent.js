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

qx.Class.define("qookery.internal.components.SplitButtonComponent", {

	extend: qookery.internal.components.Component,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {

		// Metadata

		getAttributeType: function(attributeName) {
			switch(attributeName) {
			case "show": return "String";
			}
			return this.base(arguments, attributeName);
		},

		// Lifecycle

		_createWidgets: function() {
			var button = new qx.ui.form.SplitButton();
			this._applyAttribute("command", this, function(commandName) {
				var command = qookery.Qookery.getRegistry().getCommand(commandName);
				if(command == null)
					throw new Error("Undefined command " + commandName);
				button.setCommand(command);
			});
			this._applyAttribute("icon", button, "icon");
			this._applyAttribute("label", button, "label");
			this._applyAttribute("show", button, "show");
			this._applyWidgetAttributes(button);
			return [ button ];
		}
	}
});

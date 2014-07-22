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

	extend: qookery.internal.components.BaseComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {

		create: function(attributes) {
			var widget = this._createButtonWidget(attributes);
			this._applyButtonAttributes(widget, attributes);
			this._widgets.push(widget);
			this.base(arguments, attributes);
		},

		_createButtonWidget: function(attributes) {
			var label = attributes['label'];
			var icon = attributes['icon'];
			return new qx.ui.form.Button(label, icon);
		},

		_applyButtonAttributes: function(widget, attributes) {
			if(attributes["icon-position"] !== undefined) widget.setIconPosition(attributes["icon-position"]);
			if(attributes["rich"] !== undefined) widget.setRich(attributes["rich"]);
			if(attributes["center"] !== undefined) widget.setCenter(attributes["center"]);
			this._applyLayoutAttributes(widget, attributes);
		},

		setLabel: function(label) {
			this.getMainWidget().setLabel(label);
		},

		setValue: function(buttonLabelValue) {
			// BC Qookery: Method kept for compatibilty with former way of setting label
			this.getMainWidget().setLabel(buttonLabelValue);
		},

		setCommand: function(codeToExecute) {
			this._widgets[0].setCommand(codeToExecute);
		},

		execute: function() {
			this._widgets[0].execute();
		}

	}
});

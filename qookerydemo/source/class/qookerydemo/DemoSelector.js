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

qx.Class.define("qookerydemo.DemoSelector", {

	extend: qookery.internal.components.Component,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {

		_createWidgets: function() {
			var button = new qx.ui.toolbar.MenuButton("Demo Selection", "qookerydemo/icons/24/samples.png");
			var demoListMenu = new qx.ui.menu.Menu();
			qookerydemo.Application.CONFIGURATIONS.forEach(function(configuration) {
				var label = configuration["label"];
				var button = new qx.ui.menu.Button(label);
				button.addListener("execute", function() {
					var demoName = configuration["name"];
					this.getForm().executeAction("load", demoName);
				}, this);
				demoListMenu.add(button);
			}, this);
			button.setMenu(demoListMenu);
			this._applyWidgetAttributes(button);
			return [ button ];
		}
	}
});

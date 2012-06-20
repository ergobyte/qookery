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

qx.Class.define("qookerydemo.Toolbar", {

	extend: qx.ui.toolbar.ToolBar,

	events: {
		"run": "qx.event.type.Event"
	},

	construct: function() {
		this.base(arguments);
		var runButton = new qx.ui.toolbar.Button("Run", "resource/qookerydemo/icons/24/run.png");
		runButton.addListener("execute", function() {
			this.fireEvent("run");
		}, this);
		
		var demosMenu = new qx.ui.menu.Menu();
		var demo1 = new qx.ui.menu.Button("Hello, world!");
		demo1.addListener("execute", function() {
			this.getDemo("helloWorld.xml")
		}, this);
		
		var demo2 = new qx.ui.menu.Button("Login Dialog");
		demo2.addListener("execute", function() {
			this.getDemo("loginDialog.xml")
		}, this);
		
		demosMenu.add(demo1);
		demosMenu.add(demo2);
		
		var demoMenu = new qx.ui.toolbar.MenuButton("Demos", "resource/qookerydemo/icons/24/samples.png");
		demoMenu.setMenu(demosMenu);
		this.add(demoMenu);
		this.add(runButton);
	},

	members: {
		
		getDemo: function(url) {
			var req = new qx.bom.request.Xhr();
			req.onload = function() {
				var xmlCode = req.responseText;
				qx.core.Init.getApplication().setEditor(xmlCode);
			}
			req.open("GET", qx.lang.String.format("resource/qookerydemo/xml/%1?nocache=%2", [ url, new Date().getTime() ]));
			req.send();
		}
	}
});

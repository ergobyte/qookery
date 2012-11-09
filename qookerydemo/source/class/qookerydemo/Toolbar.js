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

	statics: {
		DEMOS: [
			{ label: "Hello, World!", formFile: "helloWorld.xml"},
			{ label: "Login Dialog", formFile: "loginDialog.xml", dataFile: "loginDialog.json" },
			{ label: "Master Details", formFile: "masterDetails.xml", dataFile: "masterDetails.json" },
			{ label: "Table with Form Editor", formFile: "tableWithFormEditor.xml", dataFile: "tableWithFormEditor.json" },
			{ label: "Multiple Connections", formFile: "multipleConnections.xml", dataFile: "multipleConnections.json" }
		]
	},

	construct: function() {
		this.base(arguments);
		var runAgainButton = new qx.ui.toolbar.Button("Run Again", "resource/qookerydemo/icons/24/run.png");
		runAgainButton.addListener("execute", function() {
			qx.core.Init.getApplication().runCode();
		}, this);
		
		var aboutButton = new qx.ui.toolbar.Button("About", "resource/qookerydemo/icons/24/about_gs.png");
		aboutButton.addListener("execute", function () {
			qookerydemo.AboutWindow.open();
		}, this);
		
		var demoListMenu = new qx.ui.menu.Menu();
		qookerydemo.Toolbar.DEMOS.forEach(function(demoArguments, index) {
			var button = new qx.ui.menu.Button(demoArguments['label']);
			button.addListener("execute", function() {
				this.getDemo(demoArguments['formFile'], demoArguments['dataFile']);
			}, this);
			demoListMenu.add(button);
		}, this);
		
		var demoMenu = new qx.ui.toolbar.MenuButton("Demo Selection", "resource/qookerydemo/icons/24/samples.png");
		demoMenu.setMenu(demoListMenu);
		this.add(demoMenu);
		this.add(runAgainButton);
		this.add(aboutButton);
	},

	members: {
		
		getDemo: function(formUrl, dataUrl) {
			qookerydemo.Utils.getFile(formUrl, function(req) {
				qx.core.Init.getApplication().setXmlEditorCode(req.responseText);
				qx.core.Init.getApplication().runCode();
			});
			if(!dataUrl) {
				qx.core.Init.getApplication().setModelAreaCode("");
				return;
			}
			qookerydemo.Utils.getFile(dataUrl, function(req) {
				qx.core.Init.getApplication().setModelAreaCode(req.responseText);
			});
		}
	}
});

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
			{ label: "Hello, World!", formFile: "helloWorld.xml", modelFile: "null.json" },
			{ label: "About Dialog", formFile: "aboutDialog.xml", modelFile: "null.json" },
			{ label: "Login Dialog", formFile: "loginDialog.xml", modelFile: "loginCredentials.json" },
			{ label: "Layouts", formFile: "layouts.xml", modelFile: "null.json" },
			{ label: "Translations", formFile: "translations.xml", modelFile: "null.json" },
			{ label: "Master Details", formFile: "masterDetails.xml", modelFile: "passwordList.json" },
			{ label: "Table with Form Editor", formFile: "tableWithFormEditor.xml", modelFile: "passwordList.json" },
			{ label: "Multiple Connections", formFile: "multipleConnections.xml", modelFile: "carConfiguration.json" }
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
				this.__loadDemo(demoArguments);
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

		__loadDemo: function(demoArguments) {
			var formUrl = "resource/qookerydemo/forms/" + demoArguments['formFile'];
			qookery.contexts.Qookery.loadResource(formUrl, function(data) {
				qx.core.Init.getApplication().setXmlEditorCode(data);
				qx.core.Init.getApplication().runCode();
			});
			if(demoArguments['modelFile']) {
				var modelUrl = "resource/qookerydemo/models/" + demoArguments['modelFile'];
				qookery.contexts.Qookery.loadResource(modelUrl, function(data) {
					qx.core.Init.getApplication().setModelAreaCode(data);
				});
			}
			else {
				qx.core.Init.getApplication().setModelAreaCode("");
			}
		}
	}
});

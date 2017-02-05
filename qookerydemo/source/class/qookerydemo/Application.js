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

/**
 * @asset(qookerydemo/*)
 */
qx.Class.define("qookerydemo.Application", {

	extend: qx.application.Standalone,

	statics: {
		DEMOS: [
			{ id: "helloWorld", label: "Hello, World!", formFile: "helloWorld.xml" },
			{ id: "aboutDialog", label: "About Dialog", formFile: "aboutDialog.xml" },
			{ id: "loginDialog", label: "Login Dialog", formFile: "loginDialog.xml", modelFile: "loginCredentials.json" },
			{ id: "layouts", label: "Layouts", formFile: "layouts.xml" },
			{ id: "stack", label: "Stack", formFile: "stack.xml" },
			{ id: "translations", label: "Translations", formFile: "translations.xml" },
			{ id: "tableWithFormEditor", label: "Table with Form Editor", formFile: "tableWithFormEditor.xml", modelFile: "passwordList.json" },
			{ id: "masterDetails", label: "Master Details", formFile: "masterDetails.xml", modelFile: "passwordList.json" },
			{ id: "multipleConnections", label: "Multiple Connections", formFile: "multipleConnections.xml", modelFile: "carConfiguration.json" },
			{ id: "flowControl", label: "Flow Control", formFile: "flowControl.xml" },
			{ id: "xInclude", label: "XInclude", formFile: "xInclude.xml" },
			{ id: "richText", label: "Extension: CKeditor", formFile: "richText.xml", modelFile: "carConfiguration.json" },
			{ id: "calendar", label: "Extension: FullCalendar.io", formFile: "calendar.xml" },
			{ id: "maps", label: "Extension: Google Maps", formFile: "maps.xml", modelFile: "carConfiguration.json" }
		]
	},

	members: {

		__pendingComponents: null,
		__toolbar: null,
		__xmlEditor: null,
		__resultArea: null,
		__jsonEditor: null,

		main: function() {
			this.base(arguments);
			if(qx.core.Environment.get("qx.debug")) {
				qx.log.appender.Native;
				qx.log.appender.Console;
			}

			qookery.Qookery.setOption(qookery.maps.Bootstrap.OPTIONS_GOOGLE_API_KEY, "AIzaSyB6WP2UY69lxzzLtpdTw4GVBlXRyLF4_Pw");

			this.__pendingComponents = [ qookerydemo.ui.XmlEditor, qookerydemo.ui.JsonEditor ];
			this.__toolbar = new qookerydemo.ui.Toolbar();
			this.__xmlEditor = new qookerydemo.ui.XmlEditor();
			this.__jsonEditor = new qookerydemo.ui.JsonEditor();
			this.__resultArea = new qookerydemo.ui.ResultArea();

			var verticalSplitter = new qx.ui.splitpane.Pane("vertical");
			verticalSplitter.setDecorator(new qx.ui.decoration.Decorator().set({ width: 0 }));
			verticalSplitter.setOffset(0);
			verticalSplitter.add(this.__xmlEditor);
			verticalSplitter.add(this.__jsonEditor);

			var horizontalSplitter = new qx.ui.splitpane.Pane("horizontal");
			horizontalSplitter.add(verticalSplitter);
			horizontalSplitter.add(this.__resultArea);

			var mainContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox());
			mainContainer.add(this.__toolbar, { flex: 0 });
			mainContainer.add(horizontalSplitter, { flex: 1 });
			this.getRoot().add(mainContainer, { edge: 0 });

			qx.bom.History.getInstance().addListener("request", function(event) {
				var demoId = event.getData();
				if(demoId == null) { return; }
				this.loadDemo(demoId);
			}, this);
		},

		onComponentReady: function(component) {
			qx.lang.Array.remove(this.__pendingComponents, component);
			if(this.__pendingComponents.length > 0) { return; }

			var initialDemoId = qx.bom.History.getInstance().getState();
			if(initialDemoId == null) { initialDemoId = "helloWorld"; }
			this.loadDemo(initialDemoId);
			qx.dom.Element.remove(document.getElementById("splash"));
		},

		loadDemo: function(demoId) {
			var demoConfiguration = qookerydemo.Application.DEMOS.filter(function(configuration) {
				return configuration["id"] === demoId;
			})[0];
			if(demoConfiguration == null) {
				throw new Error("Demo " + demoId + " not found");
			}
			var formFile = demoConfiguration["formFile"];
			var formUrl = "resource/qookerydemo/forms/" + formFile;
			qookery.contexts.Qookery.loadResource(formUrl, this, function(data) {
				this.setXmlEditorCode(data);
				this.runCode();
			});
			var modelFile = demoConfiguration["modelFile"];
			if(!modelFile) {
				this.setModelAreaCode("null");
				return;
			}
			var modelUrl = "resource/qookerydemo/models/" + modelFile;
			qookery.contexts.Qookery.loadResource(modelUrl, this, function(data) {
				this.setModelAreaCode(data);
			});
		},

		setModelAreaCode: function(code) {
			this.__jsonEditor.setCode(code);
		},

		setXmlEditorCode: function(code) {
			this.__xmlEditor.setCode(code);
		},

		runCode: function() {
			var xmlCode = this.__xmlEditor.getCode();
			if(!xmlCode) { return; }
			this.__resultArea.loadForm(xmlCode);
		},

		setFormModel: function(model) {
			this.__resultArea.getFormComponent().setModel(model);
		}
	},

	destruct: function() {
		this._disposeObjects("__toolbar", "__xmlEditor", "__jsonEditor", "__resultArea" );
	}
});

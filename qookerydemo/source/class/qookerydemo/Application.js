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
 *
 * @require(qx.bom.History)
 * @require(qx.data.marshal.Json)
 * @require(qx.util.Serializer)
 */
qx.Class.define("qookerydemo.Application", {

	extend: qx.application.Standalone,

	statics: {
		CONFIGURATIONS: [
			{ name: "demo.helloWorld", label: "Demo: Hello, World!", formFile: "demos/helloWorld.xml" },
			{ name: "demo.layouts", label: "Demo: Layouts", formFile: "demos/layouts.xml" },
			{ name: "demo.stack", label: "Demo: Stack", formFile: "demos/stack.xml" },
			{ name: "demo.flowControl", label: "Demo: Flow Control", formFile: "demos/flowControl.xml" },
			{ name: "demo.translations", label: "Demo: Translations", formFile: "demos/translations.xml" },
			{ name: "demo.connections", label: "Demo: Connections", formFile: "demos/connections.xml", modelFile: "carConfiguration.json" },
			{ name: "demo.xInclude", label: "Demo: XInclude", formFile: "demos/xInclude.xml" },
			{ name: "example.loginDialog", label: "Example: Login Dialog", formFile: "examples/loginDialog.xml", modelFile: "loginCredentials.json" },
			{ name: "example.tableWithFormEditor", label: "Example: Table with Form Editor", formFile: "examples/tableWithFormEditor.xml", modelFile: "passwordList.json" },
			{ name: "example.masterDetails", label: "Example: Master Details", formFile: "examples/masterDetails.xml", modelFile: "passwordList.json" },
			{ name: "extension.richtext", label: "Extension: CKeditor", formFile: "extensions/richText.xml", modelFile: "carConfiguration.json" },
			{ name: "extension.calendar", label: "Extension: FullCalendar.io", formFile: "extensions/calendar.xml" },
			{ name: "extension.maps", label: "Extension: Google Maps", formFile: "extensions/maps.xml", modelFile: "carConfiguration.json" },
			{ name: "this.rootForm", label: "This Application: Root Form", formFile: "application.xml" },
			{ name: "this.aboutDialog", label: "This Application: About Dialog", formFile: "aboutDialog.xml" }
		]
	},

	members: {

		__form: null,

		main: function() {
			this.base(arguments);

			// Setup Qooxdoo
			if(qx.core.Environment.get("qx.debug")) {
				qx.log.appender.Native; // jshint ignore:line
				qx.log.appender.Console; // jshint ignore:line
			}

			// Setup Qookery
			qookery.Qookery.setOption(qookery.maps.Bootstrap.OPTIONS_GOOGLE_API_KEY, "AIzaSyB6WP2UY69lxzzLtpdTw4GVBlXRyLF4_Pw");
			qookery.Qookery.getRegistry().registerComponentType("{http://www.qookery.org/ns/Form/Demo}demo-selector", qookerydemo.DemoSelector);
			qookery.Qookery.getRegistry().registerComponentType("{http://www.qookery.org/ns/Form/Demo}result-area", qookerydemo.ResultArea);

			// Load application form and install it in root composite
			var applicationXml = qookery.Qookery.getService("ResourceLoader", true).loadResource("qookerydemo/forms/application.xml");
			var applicationDocument = qx.xml.Document.fromString(applicationXml);
			var parser = qookery.Qookery.createFormParser({ isRoot: true });
			try {
				this.__form = parser.parseXmlDocument(applicationDocument);
				this.getRoot().add(this.__form.getMainWidget(), { edge: 0 });
				qx.core.Id.getInstance().register(this.__form, "qookerydemo");
			}
			catch(e) {
				this.error("Error creating application root form", e);
				return;
			}
			finally {
				parser.dispose();
			}

			// Remove splash screen
			qx.dom.Element.remove(document.getElementById("splash"));
		},

		getDemoConfiguration: function(name) {
			return this.constructor.CONFIGURATIONS.filter(function(c) { return c["name"] === name; })[0];
		}
	},

	destruct: function() {
		this._disposeObjects("__form");
	}
});

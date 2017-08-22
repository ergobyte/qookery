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
 * @require(qx.data.marshal.Json)
 * @require(qx.util.Serializer)
 */
qx.Class.define("qookerydemo.Application", {

	extend: qx.application.Standalone,

	statics: {
		DEMOS: [
			{ name: "helloWorld", label: "Hello, World!", formFile: "helloWorld.xml" },
			{ name: "aboutDialog", label: "About Dialog", formFile: "aboutDialog.xml" },
			{ name: "loginDialog", label: "Login Dialog", formFile: "loginDialog.xml", modelFile: "loginCredentials.json" },
			{ name: "layouts", label: "Layouts", formFile: "layouts.xml" },
			{ name: "stack", label: "Stack", formFile: "stack.xml" },
			{ name: "translations", label: "Translations", formFile: "translations.xml" },
			{ name: "tableWithFormEditor", label: "Table with Form Editor", formFile: "tableWithFormEditor.xml", modelFile: "passwordList.json" },
			{ name: "masterDetails", label: "Master Details", formFile: "masterDetails.xml", modelFile: "passwordList.json" },
			{ name: "multipleConnections", label: "Multiple Connections", formFile: "multipleConnections.xml", modelFile: "carConfiguration.json" },
			{ name: "flowControl", label: "Flow Control", formFile: "flowControl.xml" },
			{ name: "xInclude", label: "XInclude", formFile: "xInclude.xml" },
			{ name: "richText", label: "Extension: CKeditor", formFile: "richText.xml", modelFile: "carConfiguration.json" },
			{ name: "calendar", label: "Extension: FullCalendar.io", formFile: "calendar.xml" },
			{ name: "maps", label: "Extension: Google Maps", formFile: "maps.xml", modelFile: "carConfiguration.json" },
			{ name: "recursion", label: "*this*", formFile: "application.xml" }
		]
	},

	members: {

		__applicationForm: null,

		main: function() {
			this.base(arguments);

			// Setup Qooxdoo
			if(qx.core.Environment.get("qx.debug")) {
				qx.log.appender.Native;
				qx.log.appender.Console;
			}

			// Setup Qookery
			qookery.Qookery.setOption(qookery.maps.Bootstrap.OPTIONS_GOOGLE_API_KEY, "AIzaSyB6WP2UY69lxzzLtpdTw4GVBlXRyLF4_Pw");
			qookery.Qookery.getRegistry().registerComponentType(
					"{http://www.qookery.org/ns/Form/Demo}demo-selector",
					qookery.impl.WrapperComponent.bind(null, qookerydemo.DemoSelector));
			qookery.Qookery.getRegistry().registerComponentType(
					"{http://www.qookery.org/ns/Form/Demo}result-area",
					qookery.impl.WrapperComponent.bind(null, qookerydemo.ResultArea));

			// Load application form and install it in root composite
			var applicationXml = qookery.Qookery.getService("ResourceLoader", true).loadResource("qookerydemo/forms/application.xml");
			var applicationDocument = qx.xml.Document.fromString(applicationXml);
			var parser = qookery.Qookery.createFormParser();
			try {
				var component = this.__applicationForm = parser.parseXmlDocument(applicationDocument);
				this.getRoot().add(component.getMainWidget(), { edge: 0 });
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
			return this.constructor.DEMOS.filter(function(c) { return c["name"] === name; })[0];
		}
	},

	destruct: function() {
		this._disposeObjects("__applicationForm");
	}
});

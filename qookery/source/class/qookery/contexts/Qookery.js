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

qx.Class.define("qookery.contexts.Qookery", {

	type: "static",

	statics: {

		/**
		 * Use resource loader to load a resource
		 *
		 * @param {} resourceUrl the URL of the resource to load
		 * @param {} callback a callback to call on successful loading
		 */
		loadResource: function(resourceUrl, callback) {
			qookery.Qookery.getInstance().getResourceLoader().loadResource(resourceUrl, callback);
		},

		createFormComponent: function(xmlCode, parentComposite, layoutData, formCloseHandler) {
			var xmlDocument = qx.xml.Document.fromString(xmlCode);
			var parser = qookery.Qookery.getInstance().createNewParser();
			try {
				var formComponent = parser.create(xmlDocument, parentComposite, layoutData);
				formComponent.addListener("closeForm", function(event) {
					if(formCloseHandler) formCloseHandler(event);
					qx.log.Logger.debug(parentComposite, qx.lang.String.format("Form window destroyed", [ ]));
				});
				formComponent.fireEvent("openForm", qx.event.type.Event, null);
				qx.log.Logger.debug(parentComposite, qx.lang.String.format("Form window created", [ ]));
				return formComponent;
			}
			catch(e) {
				qx.log.Logger.error(parentComposite, qx.lang.String.format("Error creating form window: %1", [ e ]));
				if(e.stack) qx.log.Logger.error(e.stack);
			}
			finally {
				parser.dispose();
			}
			return null;
		},

		openWindow: function(formUrl, model, resultCallback, title, icon) {
			icon = icon || null;
			title = title || null;
			qookery.Qookery.getInstance().getResourceLoader().loadResource(formUrl, function(data) {
				var window = new qookery.impl.FormWindow(title, icon);
				window.createAndOpen(data, model);
				window.addListener("disappear", function() {
					if(resultCallback) resultCallback(window.getFormComponent().getResult());
					window = null;
				});
			});
		}
	}
});
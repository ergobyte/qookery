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
		 * @param resourceUri {String} the URI of the resource to load
		 * @param callback {Function} a callback to call after successful load
		 */
		loadResource: function(resourceUri, callback) {
			qookery.Qookery.getInstance().getResourceLoader().loadResource(resourceUri, callback);
		},

		/**
		 * Open a window with a form as content
		 *
		 * @param form {String|qookery.IFormComponent} URL of the XML form to load, or a form component
		 * @param model {var?null} an optional model to load into the form
		 * @param resultCallback {Function?null} a callback that will receive the form's result property on close
		 * @param caption {String?null} a caption for the created Window instance
		 * @param icon {String?null} an icon for the created Window instance
		 */
		openWindow: function(form, model, resultCallback, caption, icon) {
			var window = new qookery.impl.FormWindow(caption, icon);
			window.addListener("disappear", function() {
				var result = window.getFormComponent().getResult();
				if(resultCallback) resultCallback(result);
				window = null;
			});
			if(qx.Class.implementsInterface(form, qookery.IFormComponent)) {
				window.openForm(form, model);
			}
			else this.loadResource(form, function(formXml) {
				window.createAndOpen(formXml, model);
			});
		}
	}
});

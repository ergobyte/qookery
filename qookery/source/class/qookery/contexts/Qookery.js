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

/**
 * The 'Qookery' scripting context is always available to XML authors and provides
 * a number of commonly used methods.
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
		loadResource: function(resourceUri, thisArg, successCallback, failCallback) {
			return qookery.Qookery.getResourceLoader().loadResource(resourceUri, thisArg, successCallback, failCallback);
		},

		/**
		 * Open a window with a form as content
		 *
		 * @param form {String|qookery.IFormComponent} URL of the XML form to load, or a form component
		 * @param options {Map ? null} any number of options modifying operation
		 *
		 * @option model {var ? null} an optional model to load into the form
		 * @option onClose {Function ? null} a callback that will receive the form's result property on close
		 * @option caption {String ? null} a caption for the created Window instance
		 * @option icon {String ? null} an icon for the created Window instance
		 * @option variables {Map ? null} optional variables to pass to the form parser
		 */
		openWindow: function(form, options) {
			if(!options) options = {};
			var window = new qookery.impl.FormWindow(options['caption'], options['icon'], options['preventEscape']);
			window.addListener("disappear", function() {
				var result = window.getFormComponent().getResult();
				if(options['onClose']) options['onClose'](result);
				window = null;
			});
			if(qx.Class.implementsInterface(form, qookery.IFormComponent)) {
				window.openForm(form, options['model']);
			}
			else this.loadResource(form, null, function(formXml) {
				window.createAndOpen(formXml, options['model'], options['variables']);
			});
			return window;
		},

		/**
		 * Create a new format instance
		 *
		 * @param formatterName {String} the symbolic name of the registered format class
		 * @param options {Map ? null} any number of options to pass to the format class constructor
		 *
		 * @return {qx.util.format.IFormat} new format instance or null if not available
		 */
		createFormat: function(formatterName, options) {
			return qookery.Qookery.getRegistry().createFormat(formatterName, options);
		},

		createComponent: function(parentComponent, componentClassName, attributes) {
			var component = qookery.Qookery.getRegistry().createComponent(componentClassName, parentComponent);
			component.create(attributes);
			component.setup(attributes);
			return component;
		}
	}
});

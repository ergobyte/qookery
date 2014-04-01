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
		 * @param thisArg {Object ? null} an object to set as <code>this</code> for callbacks
		 * @param successCallback {Function} callback to call after successful load
		 * @param failCallback {Function} callback to call in case load fails
		 * 
		 * @return {String|null} loaded resource as text in case call is synchronous
		 */
		loadResource: function(resourceUri, thisArg, successCallback, failCallback) {
			return qookery.Qookery.getResourceLoader().loadResource(resourceUri, thisArg, successCallback, failCallback);
		},

		/**
		 * Open a window with a form as content
		 *
		 * @param form {String|qookery.IFormComponent} URL of the XML form to load, or a form component
		 * @param options {Map ? null} any of FormWindow options in addition to any of those below
		 * 		<ul>
		 * 		<li>model {any} an optional model to load into the form</li>
		 * 		<li>variables {Map ? null} optional variables to pass to the form parser</li>
		 * 		</ul>
		 * @param thisArg {Object ? null} an object to set as <code>this</code> for callbacks
		 * 
		 * @return {qookery.impl.FormWindow} the newly opened form window
		 */
		openWindow: function(form, options, thisArg) {
			if(!options) options = {};
			var window = new qookery.impl.FormWindow(null, null, options, thisArg);
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

		/**
		 * Programmatically create a new Qookery component
		 * 
		 * @param parentComponent {qookery.IContainerComponent} the parent component to hold new component
		 * @param componentClassName {String} the name of the new component's implementation class
		 * @param attributes {Map ? null} any number of attributes understood by new component implementation
		 * 
		 * @return {qookery.IComponent} newly created component
		 */
		createComponent: function(parentComponent, componentClassName, attributes) {
			var component = qookery.Qookery.getRegistry().createComponent(componentClassName, parentComponent);
			component.create(attributes);
			component.setup(attributes);
			return component;
		},
		
		/**
		 * 
		 * @param url {String} the URI of the resource to load
		 * @param thisArg {Object} an object to set as <code>this</code> for callbacks
		 * @param successCallBack {Function} callback to call after successful load
		 * @param failCallback {Function} callback to call in case load fails
		 * @param model {Object} the form model
		 * @param variables {Object ? null} variables that will be available in xml <code> $.variableName</code>
		 * @return {String|null} loaded resource as text in case call is synchronous
		 */
		loadForm: function(url, thisArg, successCallBack, failCallback, model, variables) {
			var callBack = function(xmlCode) {
				var xmlDocument = qx.xml.Document.fromString(xmlCode);
				var parser = qookery.Qookery.createFormParser(variables);
				try {
					var formComponent = parser.parseXmlDocument(xmlDocument);
					if(successCallBack) successCallBack.call(thisArg, formComponent, model, variables);
				}
				catch(error) {
					qx.log.Logger.error(this, qx.lang.String.format("Error creating form editor: %1", [ error ]));
					qx.log.Logger.error(error.stack);
				}
				finally {
					parser.dispose();
				}
			};
			return qookery.Qookery.getResourceLoader().loadResource(url, thisArg, callBack, failCallback);
		}
	}
});

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
 * Static class providing access to main Qookery features
 */
qx.Class.define("qookery.Qookery", {

	type: "static",

	statics: {

		// Prefixed attributes - see XSD for their definition

		A_FORMAT: "{http://www.qookery.org/ns/Form}format",

		A_ICON: "{http://www.qookery.org/ns/Form}icon",

		A_MAP: "{http://www.qookery.org/ns/Form}map",

		A_TOOL_TIP_TEXT: "{http://www.qookery.org/ns/Form}tool-tip-text",

		// Options

		/**
		 * Default value of <code>spacing-x</code> attribute for layout managers that support it
		 */
		OPTION_DEFAULT_LAYOUT_SPACING_X: "q:default-layout-spacing-x",

		/**
		 * Default value of <code>spacing-y</code> attribute for layout managers that support it
		 */
		OPTION_DEFAULT_LAYOUT_SPACING_Y: "q:default-layout-spacing-y",

		/**
		 * Default value of <code>live-update</code> attribute for components that support it
		 */
		OPTION_DEFAULT_LIVE_UPDATE: "q:default-live-update",

		/**
		 * Default value of <code>native-context-menu</code> attribute for components that support it
		 */
		OPTION_DEFAULT_NATIVE_CONTEXT_MENU: "q:default-native-context-menu",

		/**
		 * {String} Path to directory containing external libraries used by Qookery, defaults to <code>qookery/lib</code>.
		 */
		OPTION_EXTERNAL_LIBRARIES: "q:external-libraries",

		// Services

		/**
		 * Currently running Qooxdoo application
		 */
		SERVICE_APPLICATION: "qx.application.IApplication",

		/**
		 * Default model provider
		 */
		SERVICE_MODEL_PROVIDER: "qookery.IModelProvider",

		/**
		 * Qookery registry
		 */
		SERVICE_REGISTRY: "qookery.IRegistry",

		/**
		 * Currently set resource loader
		 */
		SERVICE_RESOURCE_LOADER: "qookery.IResourceLoader",

		__OPTIONS: {

			// Default values

			"q:external-libraries": "qookery/lib"
		},

		/**
		 * Return an option's value
		 *
		 * @param optionName {String} name of option
		 * @param defaultValue {any} value to return in case option is not set
		 *
		 * @return {any} option value
		 */
		getOption: function(optionName, defaultValue) {
			qx.core.Assert.assertString(optionName);
			var value = qookery.Qookery.__OPTIONS[optionName];
			if(value === undefined)
				return defaultValue;
			return value;
		},

		/**
		 * Set an option's value
		 *
		 * @param optionName {String} name of option
		 * @param value {any} new option value
		 */
		setOption: function(optionName, value) {
			qx.core.Assert.assertString(optionName);
			qookery.Qookery.__OPTIONS[optionName] = value;
		},

		/**
		 * Return the Qookery registry
		 *
		 * @return {qookery.IRegistry} the registry
		 */
		getRegistry: function() {
			return qookery.internal.Registry.getInstance();
		},

		/**
		 * Return a service
		 *
		 * @param serviceName {String} symbolic name of the service
		 * @param required {Boolean} if <code>true</code>, throw an exception when service is not found
		 *
		 * @return {Object} the instance of the required service or <code>null</code> if not available
		 */
		getService: function(serviceName, required) {
			var registry = qookery.internal.Registry.getInstance();
			var service = registry.getService(serviceName);
			if(service != null || !required) return service;
			throw new Error("Required service '" + serviceName + "' is not available");
		},

		/**
		 * Create a new Qookery form parser
		 *
		 * <p>You can use the parser for parsing XML documents in order to create a new form
		 * components. Form components may then be displayed at any time by adding their
		 * main widget (currently always a composite) to the children list
		 * of container widgets.</p>
		 *
		 * <p>A demonstration of how to correctly use the form parser is:</p>
		 *
		 * <pre class="javascript">
		 * var parser = qookery.Qookery.createNewParser();
		 * try {
		 *	var formComponent = parser.parse(xmlDocument);
		 *	var mainWidget = formComponent.getMainWidget();
		 *	container.add(mainWidget);
		 * }
		 * catch(error) {
		 *	// Handle the exception
		 * }
		 * finally {
		 *	parser.dispose();
		 * }
		 * </pre>

		 * @param variables {Map ? null} optional variables to pass to generated forms
		 * @param serviceResolver {Function ? null} optional function that will be called when resolving services
		 *
		 * @return {qookery.IFormParser} newly created instance of form parser
		 */
		createFormParser: function(variables, serviceResolver) {
			if(variables == null)
				variables = { };
			if(serviceResolver == null)
				serviceResolver = function(serviceName) { return null; };
			return new qookery.internal.FormParser(variables, serviceResolver);
		}
	}
});

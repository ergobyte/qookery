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
 * Singleton class providing access to main Qookery features
 */
qx.Class.define("qookery.Qookery", {

	type: "singleton",
	extend: qx.core.Object,

	construct: function() {
		this.base(arguments);
	},

	statics: {

		OPTIONS: { },

		OPTION_DEFAULT_NATIVE_CONTEXT_MENU: "default-native-context-menu",

		getOption: function(optionName, defaultValue) {
			var value = qookery.Qookery.OPTIONS[optionName];
			if(value === undefined) return defaultValue;
			return value;
		},

		setOption: function(optionName, value) {
			qookery.Qookery.OPTIONS[optionName] = value;
		},

		/**
		 * Get the Qookery registry instance
		 *
		 * @return {qookery.IRegistry} the registry instance
		 */
		getRegistry: function() {
			return qookery.internal.Registry.getInstance();
		},

		/**
		 * Create a new Qookery form parser
		 *
		 * You can use the parser for parsing XML documents in order to create a new form
		 * components. Form components may then be displayed at any time by adding their
		 * main widget (currently always a composite) to the children list
		 * of widgets implementing the {@link qx.ui.core.MChildrenHandling} mixin.
		 *
		 * A complete demonstration of how to correctly use the form parser is:
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
		 *
		 * @return {qookery.IFormParser} newly created instance of form parser
		 */
		createFormParser: function(variables) {
			return new qookery.internal.FormParser(variables);
		},

		/**
		 * Return the default model provider implementation
		 *
		 * @return {qookery.IModelProvider} A model provider implementation
		 */
		getModelProvider: function() {
			return qookery.internal.Registry.getInstance().getModelProvider();
		},

		/**
		 * Return the currently configured resource loader
		 *
		 * @return {qookery.IResourceLoader} Resource loader implementation
		 */
		getResourceLoader: function() {
			return qookery.internal.Registry.getInstance().getResourceLoader();
		}
	}
});

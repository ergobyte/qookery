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

qx.Interface.define("qookery.IRegistry", {

	members: {

		// Services

		/**
		 * Register a new service
		 *
		 * @param serviceName {String} The symbolic name of the service
		 * @param serviceClass {qx.Class|Object} singleton class of service or any object with a getInstance() member function
		 */
		registerService: function(serviceName, serviceClass) { },

		/**
		 * Return a service's instance
		 *
		 * @return {Object} the instance of the required service or <code>null</code> if not available
		 */
		getService: function(serviceName) { },

		// Components

		/**
		 * Register a new component type
		 *
		 * @param componentQName {String} The qualified name of the component to register
		 * @param componentClass {qx.Class} The class that implements (at least) qookery.IComponent
		 * @param constructorArg {Object} Optional constructor argument
		 */
		registerComponentType: function(componentQName, componentClass, constructorArg) { },

		/**
		 * Check if a component type is available

		 * @param componentQName {String} Qualified name of a possibly registered component type
		 *
		 * @return {boolean} <code>true</code> in case the component type is available
		 */
		isComponentTypeAvailable: function(componentQName) { },

		/**
		 * Create a new component instance
		 *
		 * @param componentQName {String} Qualified name of a registered component type
		 * @param parentComponent {IComponent?null} Component that will contain new component
		 *
		 * @return {IComponent} Newly created component, an exception is thrown on error
		 */
		createComponent: function(componentQName, parentComponent) { },

		// Validators

		/**
		 * Register a validator under provided name
		 *
		 * @param name {String} the name of the validator for subsequent access
		 * @param validator {qookery.IValidator} the validator itself
		 */
		registerValidator: function(name, validator) { },

		/**
		 * Get a previously registered validator by name
		 *
		 * @param name {String} The name of the validator
		 *
		 * @return {qookery.IValidator} the validator or <code>undefined</code> if not found
		 */
		getValidator: function(name) { },

		// Model providers

		/**
		 * Register a model provider, optionally setting it as the default one
		 */
		registerModelProvider: function(providerName, providerClass, setDefault) { },

		/**
		 * Return a registered model provider
		 */
		getModelProvider: function(providerName) { },

		// Formats

		/**
		 * Register an IFormat under a symbolic name
		 *
		 * @param formatName {String} The symbolic name of the format for easy referencing
		 * @param format {qx.util.format.IFormat} The format class
		 */
		registerFormat: function(formatName, format) { },

		/**
		 * Register an IFormat factory for easy instance creation by XML authors
		 *
		 * @param factoryName {String} The name of the format class for easy referencing
		 * @param formatClass {qx.Class} The format class
		 */
		registerFormatFactory: function(factoryName, formatClass) { },

		/**
		 * Return a previously registered format
		 */
		getFormat: function(formatName) { },

		/**
		 * Parse a format specification
		 *
		 * <p>Format specification syntax is:</p>
		 *
		 * <pre>{formatName} | ( {factoryName} [ ':' {option1} '=' {value1} [ ',' {option2} '=' {value2} ]* ]? )</pre>
		 *
		 * @param specification {String} a specification according to above syntax
		 * @param options {Map} any additional options to pass to the format constructor - forces factory lookup if provided
		 *
		 * @return {qx.util.format.IFormat} the newly created format instance
		 */
		createFormat: function(specification, options) { },

		// Maps

		/**
		 * Register a map
		 *
		 * @param mapName {String} The symbolic name of the map for subsequent access
		 * @param map {Map} The map object
		 */
		registerMap: function(mapName, map) { },

		/**
		 * Return a registered map
		 *
		 * @param mapName {String} The name of the map sought
		 *
		 * @return {Map} The map object or <code>null</code> if map was not found
		 */
		getMap: function(mapName) { },

		// Libraries

		registerLibrary: function(libraryName, resourceUris, dependencies, postLoadCallback) { },

		loadLibrary: function(libraryName, callback, thisArg) { }
	}
});

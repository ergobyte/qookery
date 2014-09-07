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

		// Components

		/**
		 * Register a new component type
		 *
		 * @param typeName {String} The symbolic name of the component type for subsequent access
		 * @param componentClass {qx.Class} The class that implements (at least) qookery.IComponent
		 * @param constructorArg {Object} Optional constructor argument
		 */
		registerComponentType: function(typeName, componentClass, constructorArg) { },

		/**
		 * Check if a component type is available

		 * @param typeName {String} The symbolic name of the component type to look for
		 *
		 * @return {boolean} <code>true</code> in case the component type is available
		 */
		isComponentTypeAvailable: function(typeName) { },

		/**
		 * Create a new component instance
		 *
		 * @param typeName {String} Symbolic name of a registered component type
		 * @param parentComponent {IComponent?null} Component that will contain new component
		 *
		 * @return {IComponent} Newly created component, an exception is thrown on error
		 */
		createComponent: function(typeName, parentComponent) { },

		// Validators

		/**
		 *
		 * @param validator {String} The IValidator class name
		 * @param name {String} The name of the validator for subsequent access
		 */
		registerValidator: function(validator, name) { },

		/**
		 *
		 * @param validator {String} The name of the validator
		 * @return {IValidator} The real Validator or null
		 */
		getValidator: function(validator) { },

		// Model providers

		/**
		 * Register a model provider, optionally setting it as the default one
		 */
		registerModelProvider: function(providerName, provider, setDefault) { },

		/**
		 * Return a registered model provider
		 */
		getModelProvider: function(providerName) { },

		// Formats

		/**
		 * Register an IFormat class for easy instance creation by XML authors
		 *
		 * @param formatName {String} The name of the format class for easy referencing
		 * @param formatClass {qx.Class} The format class
		 */
		registerFormatClass: function(formatName, formatClass) { },

		/**
		 * Create a new instance of a registered format class
		 *
		 * @param formatName {String} The name of the format class
		 * @param options {Map} Options to pass to the format constructor
		 *
		 * @return {IFormat} The newly created format instance
		 */
		createFormat: function(formatName, options) { },

		/**
		 * Parse a format specification
		 * <p>Format specification syntax is:</p>
		 *
		 * <pre>{formatName} [ ':' {option1} '=' {value1} [ ',' {option2} '=' {value2} ]* ]?</pre>
		 *
		 * @param formatSpecification {String} a specification according to above syntax
		 *
		 * @return {IFormat} The newly created format instance
		 */
		createFormatSpecification: function(formatSpecification) { },

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

		// Scripts

		registerLibrary: function(libraryName, resourceUris, dependencies, postLoadCallback) { },

		loadLibrary: function(libraryName, callback, thisArg) { }
	}
});

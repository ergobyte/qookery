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
 * Forms are container components that provide a number of facilities to their descendants
 *
 * <p>Descendant components can rely on their containing form to:</p>
 *
 * <ul>
 *	<li>Maintain and resolve URI prefixes</li>
 *	<li>Resolve services via dependency injection</li>
 *	<li>Require, define or otherwise access form-level variables</li>
 *	<li>Execute JavaScript source code into a common scripting context</li>
 *	<li>Interact with a model, either directly of through connections</li>
 *	<li>Use unique, in the scope of the form, component identifiers</li>
 *	<li>Run form-level validation of current model</li>
 *	<li>Translate messages using form-local translation identifiers</li>
 *	<li>Register objects for disposal on form destruction</li>
 *</ul>
 */
qx.Interface.define("qookery.IFormComponent", {

	extend: [ qookery.IContainerComponent, qookery.IVariableProvider ],

	statics: {

		// Attribute names

		/** {Function} The service resolver associated with form */
		A_SERVICE_RESOLVER: "{http://www.qookery.org/ns/Form}service-resolver",

		/** {String} A string to prepend to all form-local translation message IDs */
		A_TRANSLATION_PREFIX: "{http://www.qookery.org/ns/Form}translation-prefix",

		/** {Map} Additional variables provided by the caller of the form parser */
		A_VARIABLES: "{http://www.qookery.org/ns/Form}variables"
	},

	events: {

		/** This event is fired when the form has been closed. Its value is set to the form's <code>result</code> variable. */
		"close": "qx.event.type.Data"
	},

	properties: {

		/** An icon for UI elements that present this form */
		icon: { check: "String", nullable: true },

		/** The form's model for data binding */
		model: { nullable: true, dereference: true, event: "changeModel" },

		/** A title for UI elements that present this form */
		title: { check: "String", nullable: true },

		/** A boolean value set to <code>false</code> when the most recent validation failed */
		valid: { check: "Boolean", nullable: false, init: true, event: "changeValid" }
	},

	members: {

		// Lifecycle

		/**
		 * Test if form is ready for processing user input
		 *
		 * <p>A form's readiness is asserted by the application via the markAsReady() method.</p>
		 */
		isReady: function() { },

		/**
		 * Assert that the form is ready for processing user input
		 */
		markAsReady: function() { },

		// Access to other components

		/**
		 * Return a component registered within this form
		 *
		 * @param componentId {String} the unique identifier of the requested component
		 * @param required {Boolean?} if <code>true</code>, throw an error in case component is not found
		 *
		 * @return {qookery.IComponent} component or <code>null</code> if not found
		 */
		getComponent: function(componentId, required) { },

		/**
		 * Return the form that is the parent of this form, or <code>null</code> if no such linkage exists
		 */
		getParentForm: function() { },

		// Services

		/**
		 * Return the form's model provider if set, or the default one otherwise
		 */
		getModelProvider: function() { },

		/**
		 * Attempt to resolve a service by using installed service resolver
		 *
		 * <p>This method will delegate the request to parent form if service is unavailable</p>
		 *
		 * @param serviceName {String} the name of wanted service
		 *
		 * @return {any} required service or <code>null</code> if not available
		 */
		resolveService: function(serviceName) { },

		// Scripting

		/**
		 * Return the JavaScript context that is used by Qookery scripting code
		 *
		 * @return {Object} a suitable JavaScript context
		 */
		getScriptingContext: function() { },

		// Operations

		/**
		 * Validate form contents
		 *
		 * @return {qookery.util.ValidationError?} error found or <code>null</code> in case form is valid
		 */
		validate: function() { },

		/**
		 * Close the form
		 *
		 * @param result {any} optional value to set into the <code>result</code> variable
		 */
		close: function(result) { }
	}
});

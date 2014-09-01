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
 * Form components implement this interface
 */
qx.Interface.define("qookery.IFormComponent", {

	extend: qookery.IContainerComponent,

	events: {

		/**
		 * This event is fired when the form has been closed. Its value is set to the form's <code>result</code> variable.
		 */
		"close": "qx.event.type.Data"
	},

	properties: {

		/** An icon for UI elements that present this form */
		icon: { nullable: true },

		/** The form's model for data binding */
		model: { nullable: true, dereference: true, event: "changeModel" },

		/** A title for UI elements that present this form */
		title: { check: "String", nullable: true },

		/** A boolean value set to <code>false</code> when the most recent validation failed */
		valid: { check: "Boolean", nullable: false, init: true, event: "changeValid" }
	},

	members: {

		/**
		 * Return a component registered within this form
		 *
		 * @param componentId {String} the unique identifier of the requested component
		 *
		 * @return {qookery.IComponent} The component or <code>null</cide> if not found
		 */
		getComponent: function(componentId) { },

		/**
		 * Return the form's model provider if set, or the default one otherwise
		 */
		getModelProvider: function() { },

		// Variables

		/**
		 * Get a form variable's value
		 *
		 * @param variableName {String} the name of the variable
		 *
		 * @return {any} variable value or <code>undefined</code>
		 */
		getVariable: function(variableName) { },

		/**
		 * Set a form variable's value
		 *
		 * @param variableName {String} the name of the variable
		 * @param value {any} the new variable value
		 */
		setVariable: function(variableName, value) { },

		// Scripting

		/**
		 * Return the JavaScript context that is used by Qookery scripting code
		 *
		 * @return {Object} a suitable JavaScript context
		 */
		getClientCodeContext: function() { },

		/**
		 * Register a value within the client scripting context
		 *
		 * @param key {String} The name of the user context
		 * @param userContext {Object} A qooxdoo class with the desired functionality
		 */
		registerUserContext: function(key, userContext) { },

		// Validation

		/**
		 * Add a validation to the list of validations performed by this form
		 *
		 * The validator can either return a boolean or throw a {@link qx.core.ValidationError}
		 *
		 * @param component {qookery.IEditableComponent} editable component to check against
		 * @param validator {Function} validator function
		 */
		addValidation: function(component, validatorFunction) { },

		/**
		 * Remove component's validations from the form validations
		 *
		 * @param component {qookery.IEditableComponent} Component to look for, or <code>null</code> to remove all validations
		 */
		removeValidations: function(component) { },

		/**
		 * Invokes the form validation
		 *
		 * <p>The result of the validation is also set in the valid property.</p>
		 *
		 * @return {Array} The validation result
		 */
		validate: function() { },

		/**
		 * Reset all form validations
		 */
		resetValidation: function() { },

		/**
		 * Close the form
		 *
		 * @param result {any} optional value to set into the <code>result</code> variable
		 */
		close: function(result) { }
	}
});

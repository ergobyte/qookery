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
 * Interface for components that support value editing
 */
qx.Interface.define("qookery.IEditableComponent", {

	extend: qookery.IComponent,

	properties: {

		/** Component's current value */
		value: { event: "changeValue" },

		/** Label which will be displayed close to component's interactive widgets */
		label: { check: "String", nullable: true },

		/** Tooltip text to display when the user hovers the mouse over the component's interactive widgets */
		toolTip: { check: "String", nullable: true },

		/** Whether the component's value is required */
		required: { check: "Boolean", nullable: false, init: false },

		/** Whether the component's widget state is valid or not */
		valid: { check: "Boolean", nullable: false, init: true },

		/** A format to be used when displaying values */
		format: { check: "qx.util.format.IFormat", nullable: true },

		/** If true, this editor's value cannot be altered by its UI widgets */
		readOnly: { check: "Boolean", nullable: false, init: false }
	},

	members: {

		/**
		 * Create a two way binding between form's model and component's value
		 *
		 * @param formComponent {qookery.IFormComponent} The form component
		 * @param propertyPath {String} A valid model property pth
		 */
		connect: function(formComponent, propertyPath) { },

		/**
		 * Add a validation to the component
		 *
		 * @param validationType {String} name of a registered Qookery validator
		 * @param invalidMessage {String?null} error message to use in case of validation failure, <code>null</code> for default one(s)
		 * @param options {Map?null} validator specific options
		 */
		addValidation: function(validatorType, invalidMessage, options) { },

		/**
		 * Clear all validators
		 *
		 * @param {} component
		 */
		clearValidations: function() { }
	}
});

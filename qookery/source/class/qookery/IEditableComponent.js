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
		required: { check: "Boolean", nullable: false, init: false }
	},

	members: {

		/**
		 * Create a two way binding between controller and component's value
		 *	
		 * @param controller {qx.data.controller.Object} The form controller that the bindings
		 * @param path {String} The protocol path
		 */
		connect: function(controller, propertyPath) { },

		/**
		 * Add a validation to the component
		 *
		 * @param validationOptions {Object} validation options, see below
		 * 
		 * @argument type One of <code>notNull</code>, <code>regularExpression</code>
		 * @argument message Error message in case validator fails
		 */
		addValidation: function(validationOptions) { },

		/**
		 * Clear all validators
		 * 
		 * @param {} component
		 */
		clearValidations: function() { }
	}
});

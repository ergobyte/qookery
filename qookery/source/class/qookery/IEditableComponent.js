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
 * Interface for components that support data editing
 */
qx.Interface.define("qookery.IEditableComponent", {

	extend: qookery.IComponent,
	
	members: {

		/**
		 * Return the component's main value, if any
		 * 
		 * @return {any} the component's main value
		 */
		getValue: function() { },

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

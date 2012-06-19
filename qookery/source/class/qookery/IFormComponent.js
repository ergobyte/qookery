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
 * Form components implement this interface
 */
qx.Interface.define("qookery.IFormComponent", {

	extend: qookery.IContainerComponent,
	
	events: {

		/**
		 * This event is fired when a Qookery form is about to close.
		 */
		"formClose": "qx.event.type.Event",

		/**
		 * Event for informing listeners that a Qookery form's model has changed
		 */
		"modelChanged": "qx.event.type.Event"
	},

	members: {
		
		/**
		 * Return form identifier, as provided on form creation
		 */
		getId: function() { },

		/**
		 * Validate the form's state
		 *
		 * @return {Boolean} <code>true</code> in case the form's state is valid
		 */
		validate: function() { },

		/**
		 * Get the form's model
		 */
		getModel: function() { },

		/**
		 * Set the form's model
		 */
		setModel: function(model) { },

		/**
		 * Return the form's underlying object controller
		 * 
		 * @return {qx.data.controller.Object} The form's controller
		 */
		getController: function() { }
	}
});

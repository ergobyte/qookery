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
		 * This event is fired when the form has been closed
		 */
		"close": "qx.event.type.Event",

		/**
		 * This event is fired when the form component is about to be disposed
		 */
		"dispose": "qx.event.type.Event"
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
		 * Validate the form's state
		 *
		 * @return {Boolean} <code>true</code> in case the form's state is valid
		 */
		validate: function() { },

		/**
		 * Return a component registered within this form
		 *
		 * @param componentId {String} the unique identifier of the requested component
		 *
		 * @return {qookery.IComponent} The component or <code>null</cide> if not found
		 */
		getComponent: function(componentId) { }
	}
});

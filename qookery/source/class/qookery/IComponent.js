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
 * Each and every Qookery user interface component implements this interface
 */
qx.Interface.define("qookery.IComponent", {

	properties: {

		/** Whether the component is enabled */
		enabled: { init: true, check: "Boolean" },

		/** Whether the component is visible */
		visible: { init: true, check: "Boolean" }
	},
	
	members: {

		/**
		 * Return the component identifier, if any
		 * 
		 * <p>
		 * The identifier must by unique for each component within a form
		 * </p>
		 * 
		 * @return {String} unique identifier or <code>null</code>
		 */
		getId: function() { },

		/**
		 * Return the form containing this component
		 * 
		 * @return {qookery.IFormComponent} the form containing this component
		 */
		getForm: function() { },

		/**
		 * Return the parent component or <code>null</cide> if this is the root component
		 * 
		 * @return {qookery.IComponent} parent component or <code>null</code>
		 */
		getParent: function() { },
		
		/**
		 * Set the focus to this component
		 */
		focus: function() { },

		/**
		 * Return a list of widgets that are handled by this component
		 * 
		 * @param filterName {String} If set, one of 'topMost', 'main' to restrict resulting list
		 * 
		 * @return {qx.ui.core.Widget[]} widget list - an empty array if none found
		 */
		listWidgets: function(filterName) { },

		/**
		 * Return the first main widget
		 * 
		 * <p>This method a shorthand for #listWidgets('main')[0]</p>
		 * 
		 * @return {qx.ui.core.Widget} the first main widget
		 */
		getMainWidget: function() { }
	}
});

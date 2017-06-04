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
 * Interface for components that are containers of other components
 */
qx.Interface.define("qookery.IContainerComponent", {

	extend: qookery.IComponent,

	members: {

		/**
		 * Add a component as a child of this component
		 *
		 * @param component {qookery.IComponent} the component to add to this component
		 *
		 * @throw an exception is thrown in case this component does not support children
		 */
		add: function(component) { },

		/**
		 * Remove component from the children list
		 *
		 * @param component {qookery.IComponent} component to remove
		 */
		remove: function(component) { },

		/**
		 * Return index of component in the children list
		 *
		 * @param component {qookery.IComponent} component to find index of
		 *
		 * @return {Number} component index or <code>-1</code> if no found in children list
		 */
		contains: function(component) { },

		/**
		 * Return a list of all component's registered as children if this component
		 *
		 * @return {Array} children list
		 */
		listChildren: function() { }
	}
});

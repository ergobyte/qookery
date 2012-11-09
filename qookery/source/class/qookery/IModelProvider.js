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
 * Model providers bridge user-provided data functionality with Qookery interfaces
 */
qx.Interface.define("qookery.IModelProvider", {

	members: {

		/**
		 * Return a JavaScript primitive (string, integer) that uniquely identifies model object
		 * 
		 * <p>
		 * The result must be such so that a == b <=> getPrimitive(a) == getPrimitive(b)
		 * </p>
		 * 
		 * @param {any} a model object - it can never be <code>null</code>
		 * 
		 * @return {String} any JavaScript primitive
		 */
		getIdentity: function(object) { },

		/**
		 * Return a human-friendly label for a model object
		 * 
		 * @param {any} a model object - it can never be <code>null</code>
		 * 
		 * @return {String} any textual label or <code>null</code> if none available
		 */
		getLabel: function(object) { },

		/**
		 * Handle connection specification of a connectable component
		 * 
		 * @param connectableComponent {qookery.IComponent} a component that supports data binding
		 * @param namespaceUri {String} a namespace URI that the provider may use to differentiate connection types
		 * @param path {String} the path of the property specified by the XML author
		 */
		handleConnection: function(connectableComponent, connectionUri, path) { },
		
		/**
		 * Clone an object
		 */
		clone: function(object) { }
	}
});

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
 * Model providers bridge user-provided data functionality with Qookery interfaces
 */
qx.Interface.define("qookery.IModelProvider", {

	members: {

		/**
		 * Return a JavaScript primitive or array of primitives that uniquely identifies model object
		 *
		 * <p>The result must be such so that if a == b, then identityOf(a) == identityOf(b) and vice-versa.</p>
		 * <p>The result must be <code>null</code> when no input was passed.</p>
		 *
		 * @param object {any} model object - it may be <code>null</code>
		 *
		 * @return {any} any JavaScript primitive or array of primitives
		 */
		identityOf: function(object) { },

		/**
		 * Test two model objects for equality
		 *
		 * <p>Method must be null-safe:
		 *		equals(null, null) -> true and
		 *		equals(null, non-null) -> false</p>
		 *
		 * @param object1 {any} model object, may be <code>null</code>
		 * @param object2 {any} model object, may be <code>null</code>
		 *
		 * @return {Boolean} <code>true</code> if objects are equal or both <code>null</code>
		 */
		areEqual: function(object1, object2) { },

		/**
		 * Return a human-friendly label for a model object
		 *
		 * @param object {any} model object - it may not be <code>null</code>
		 * @param labelType {String?} optional symbolic name of needed label type
		 *
		 * @return {String} any textual label or <code>null</code> if none available
		 */
		getLabel: function(object, labelType) { },

		/**
		 * Handle connection specification of a connectable component
		 *
		 * @param formParser {qookery.IFormParser} optinal parser requesting connection, may be <code>null</code>
		 * @param connectableComponent {qookery.IComponent} a component that supports data binding
		 * @param connectionSpecification {String} a specification that may be parsed by the model provider
		 *
		 * @return {any} implementation specific value that may be used with getConnectionAttribute()
		 */
		handleConnection: function(formParser, connectableComponent, connectionSpecification) { },

		/**
		 * Return the value of a connection's attribute, if available
		 *
		 * @param connectionHandle {any} the opaque value returned by handleConnection()
		 * @param attributeName {String} name of wanted attribute
		 *
		 * @return {any} attribute's value or <code>undefined
		 */
		getConnectionAttribute: function(connectionHandle, attributeName) { },

		/**
		 * Clone an object
		 *
		 * @param object {any} model object to clone
		 */
		clone: function(object) { }
	}
});

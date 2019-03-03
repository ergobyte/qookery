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
 * Represents a supplier of attributes
 */
qx.Interface.define("qookery.IAttributeSet", {

	members: {

		/**
		 * Return an attribute's value if defined, or a default value if missing
		 *
		 * <p>You may supply the <code>Error</code> JS build-in object as the default value parameter
		 * in order to request that a range error is thrown when attribute is missing.</p>
		 *
		 * @param name {String} the name of the wanted attribute
		 * @param defaultValue {any} optional default value, <code>undefined</code> will be used if not provided
		 *
		 * @return {any} attribute's value or requested default value if attribute is not defined within the set
		 *
		 * @throws {RangeError} in case attribute is not part of the set and the default value was set to <code>Error</code>
		 */
		getAttribute: function(name, defaultValue) { }
	}
});

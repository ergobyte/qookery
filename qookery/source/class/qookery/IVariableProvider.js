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
 * Interface for classes that provide the value of variables when asked
 */
qx.Interface.define("qookery.IVariableProvider", {

	members: {

		/**
		 * Get a variable's value
		 *
		 * @param variableName {String} the name of the variable
		 *
		 * @return {any} variable value or <code>undefined</code>
		 */
		getVariable: function(variableName) { },

		/**
		 * Set a variable's value
		 *
		 * @param variableName {String} the name of the variable
		 * @param value {any} the new variable value
		 */
		setVariable: function(variableName, value) { }
	}
});

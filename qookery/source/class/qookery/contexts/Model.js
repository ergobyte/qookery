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
 * Scripting context for easily calling common model provider functions
 */
qx.Class.define("qookery.contexts.Model", {

	type: "static",

	statics: {

		/**
		 * Access to {@link qookery.IModelProvider#identityOf}
		 */
		identityOf: function(object) {
			return qookery.Qookery.getModelProvider().identityOf(object);
		},

		/**
		 * Access to {@link qookery.IModelProvider#areEqual}
		 */
		areEqual: function(object1, object2) {
			return qookery.Qookery.getModelProvider().areEqual(object1, object2);
		},

		/**
		 * Access to {@link qookery.IModelProvider#compare}
		 */
		compare: function(object1, object2) {
			return qookery.Qookery.getModelProvider().compare(object1, object2);
		}
	}
});

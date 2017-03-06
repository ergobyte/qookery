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
 * Implementations of this interface provide resources requested by Qookery
 */
qx.Interface.define("qookery.IResourceLoader", {

	members: {

		/**
		 * Return the URI of a named resource
		 *
		 * <p>This method allows applications to extend or replace default resolution performed
		 * by qx.util.ResourceManager</p>
		 *
		 * @param name {String} the name of the resource
		 *
		 * @return {String} a URI that can be used to load the resource
		 */
		resolveResourceUri: function(name) { },

		/**
		 * Load a remote resource (sync or async)
		 *
		 * <p>Calls to this method imply synchronous loading when no success
		 * callback has been set</p>
		 *
		 * @param name {String} name of the wanted resource
		 * @param thisArg {Object ? null} optional context for callbacks, may be <code>null</code>
		 * @param successCallback {Function} optional function to be called on asynchronous load success
		 * @param failCallback {Function} optional function to be called on asynchronous load failure
		 */
		loadResource: function(name, thisArg, successCallback, failCallback) { }
	}
});

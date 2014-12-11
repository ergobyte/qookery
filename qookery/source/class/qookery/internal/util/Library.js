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

qx.Class.define("qookery.internal.util.Library", {

	extend: Object,
	include: [ qx.core.MLogging ],

	construct: function(libraryName, resourceUris, dependencies, postLoadCallback) {
		this.__libraryName = libraryName;
		this.__resourceUris = resourceUris;
		this.__dependencies = dependencies;
		this.__isLoaded = false;
		this.__callbacks = [ ];
		this.__postLoadCallback = postLoadCallback;
	},

	members: {

		__libraryName: null,
		__resourceUri: null,
		__dependencies: null,
		__isLoaded: null,
		__callbacks: null,
		__onLoadCallback: null,

		isLoaded: function() {
			return this.__isLoaded;
		},

		load: function(callback, thisArg) {
			// If loaded, just call the callback
			if(this.__isLoaded) {
				callback.call(thisArg);
				return;
			}

			// Push callback to the queue
			this.__callbacks.push(callback.bind(thisArg));

			// If not the first callback, return since loading has been already started
			var isLoading = this.__callbacks.length !== 1;
			if(isLoading) return;

			// Start the library loading
			this.__loadLibrary();
		},

		__loadLibrary: function() {
			// In case there are dependencies, load them first
			if(this.__dependencies && this.__dependencies.length > 0) {
				var libraryName = this.__dependencies.shift();
				qookery.Qookery.getRegistry().loadLibrary(libraryName, this.__loadLibrary, this);
				return;
			}

			// Create the request
			var resourceUri = this.__resourceUris.shift();
			var absoluteUri = qx.util.ResourceManager.getInstance().toUri(resourceUri);

			if(qx.lang.String.endsWith(absoluteUri, ".js")) {
				var scriptRequest = new qx.bom.request.Script();
				scriptRequest.onload = this.__onResourceLoaded.bind(this);
				scriptRequest.onerror = function() {
					this.error("Error loading script from", absoluteUri);
				}.bind(this);
				scriptRequest.open("GET", absoluteUri);
				scriptRequest.send();
				return;
			}
			if(qx.lang.String.endsWith(absoluteUri, ".css")) {
				// Create a new link element and initialize it
				var linkElement = document.createElement("link");
				linkElement.type = "text/css";
				linkElement.rel = "stylesheet";
				linkElement.href = absoluteUri;
				// Retrieve the HEAD element
				var headElement = document.getElementsByTagName("head")[0];
				// Begin loading the stylesheet
				qx.util.TimerManager.getInstance().start(function() {
					headElement.appendChild(linkElement);
					this.__onResourceLoaded();
				}, null, this);
				return;
			}
			throw new Error("Library uses unsupported resource type");
		},

		__onResourceLoaded: function() {
			// If not finished with resource, proceed to the next one
			if(this.__resourceUris.length !== 0) {
				this.__loadLibrary();
				return;
			}

			// Invoke the post load callback, if set
			if(this.__postLoadCallback) this.__postLoadCallback();

			// We are done loading, mark our success
			this.__isLoaded = true;
			this.debug("Loaded", this.__libraryName);

			// Invoke any waiting callbacks
			this.__callbacks.forEach(function(callback) { callback(); });
			this.__callbacks = [ ];
		}
	}
});

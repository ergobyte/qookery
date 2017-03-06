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

	construct: function(name, resourceNames, dependencies, postLoadCallback) {
		this.__name = name;
		this.__resourceNames = resourceNames;
		this.__dependencies = dependencies;
		this.__isLoaded = false;
		this.__callbacks = [ ];
		this.__postLoadCallback = postLoadCallback;
	},

	members: {

		__name: null,
		__resourceNames: null,
		__dependencies: null,
		__isLoaded: null,
		__callbacks: null,
		__postLoadCallback: null,

		getName: function() {
			return this.__name;
		},

		addResource: function(resourceName) {
			if(this.__isLoaded)
				throw new Error("Adding resource URIs to an already loaded library is not possible");
			this.__resourceNames.push(resourceName);
		},

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
			// In case there are dependencies, load them
			if(this.__dependencies && this.__dependencies.length > 0)
				return this.__loadNextDependency();

			// In case there are needed resources, load them
			if(this.__resourceNames && this.__resourceNames.length > 0)
				return this.__loadNextResource();

			// Invoke the post-load callback, if set
			if(this.__postLoadCallback) {
				var finished = this.__postLoadCallback(this.__onLibraryLoaded.bind(this));
				if(finished === false) return; // Callback is responsible to complete library loading when ready
			}

			this.__onLibraryLoaded();
		},

		__onLibraryLoaded: function() {
			// We are done loading, mark our success
			this.__isLoaded = true;
			this.debug("Loaded", this.__name);

			// Invoke any waiting callbacks
			this.__callbacks.forEach(function(callback) { callback(); });
			this.__callbacks = [ ];
		},

		__loadNextDependency: function() {
			var libraryName = this.__dependencies.shift();
			qookery.Qookery.getRegistry().loadLibrary(libraryName, this.__loadLibrary, this);
		},

		__loadNextResource: function() {
			var resourceName = this.__resourceNames.shift();
			// Create the request
			var resourceType = null;
			var atSignPosition = resourceName.indexOf("@");
			if(atSignPosition !== -1 && atSignPosition <= 3) {
				resourceType = resourceName.substring(0, atSignPosition);
				resourceName = resourceName.substring(atSignPosition + 1);
			}
			else if(qx.lang.String.endsWith(resourceName, ".js")) {
				resourceType = "js";
			}
			else if(qx.lang.String.endsWith(resourceName, ".css")) {
				resourceType = "css";
			}

			var resourceLoader = qookery.Qookery.getService("ResourceLoader");
			var resourceUri = resourceLoader.resolveResourceUri(resourceName);

			switch(resourceType) {
			case "js":
				var scriptRequest = new qx.bom.request.Script();
				scriptRequest.onload = this.__loadLibrary.bind(this);
				scriptRequest.onerror = function() {
					this.error("Error loading script from", resourceUri);
				}.bind(this);
				scriptRequest.open("GET", resourceUri);
				scriptRequest.send();
				break;
			case "css":
				// Create a new link element and initialize it
				var linkElement = document.createElement("link");
				linkElement.type = "text/css";
				linkElement.rel = "stylesheet";
				linkElement.href = resourceUri;
				// Retrieve the HEAD element
				var headElement = document.getElementsByTagName("head")[0];
				// Begin loading the stylesheet
				qx.util.TimerManager.getInstance().start(function() {
					headElement.appendChild(linkElement);
					this.__loadLibrary();
				}, null, this);
				break;
			default:
				throw new Error("Library uses unsupported resource type");
			}
		}
	}
});

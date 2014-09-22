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

qx.Class.define("qookery.impl.DefaultResourceLoader", {

	extend: qx.core.Object,
	implement: [ qookery.IResourceLoader ],

	members: {

		loadResource: function(url, thisArg, successCallback, failCallback) {
			var resourceUri = this._resolveResourceUri(url);
			var xhrRequest = new qx.bom.request.Xhr(), result = null;
			xhrRequest.onload = function() {
				var statusCode = xhrRequest.status;
				if(qx.util.Request.isSuccessful(statusCode)) {
					if(successCallback && thisArg)
						successCallback.call(thisArg, xhrRequest.responseText);
					else if(successCallback)
						successCallback(xhrRequest.responseText);
					else
						result = xhrRequest.responseText;
				}
				else {
					if(failCallback && thisArg)
						failCallback.call(thisArg, xhrRequest);
					else if(failCallback)
						failCallback(xhrRequest);
					else
						throw new Error(qx.lang.String.format(
							"Error %1 loading resource '%2': %3", [ xhrRequest.status, url, xhrRequest.statusText ]));
				}
			};
			var asynchronous = !!successCallback;
			xhrRequest.open("GET", resourceUri, asynchronous);
			xhrRequest.send();
			return result;
		},

		_resolveResourceUri: function(url) {
			return qx.util.ResourceManager.getInstance().toUri(url);
		}
	}
});

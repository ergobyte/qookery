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

	implement: [ qookery.IResourceLoader ],
	type: "singleton",
	extend: qx.core.Object,

	members: {

		loadResource: function(url, thisArg, successCallback, failCallback, asynchronousRequest) {
			var resourceUri = qx.util.ResourceManager.getInstance().toUri(url);
			if(qx.core.Environment.get("qx.debug")) resourceUri += "?nocache=" + new Date().getTime();
			var result = null, asynchronous;
			asynchronous = (typeof asynchronousRequest === 'undefined' || asynchronousRequest === true) ? true : false;
			var xhrRequest = new qx.bom.request.Xhr();
			if(successCallback && thisArg) {
				xhrRequest.onload = function(event) {
					successCallback.call(thisArg, xhrRequest.responseText);
				};
			}
			else if(successCallback) {
				xhrRequest.onload = function(event) {
					successCallback(xhrRequest.responseText);
				};
			}
			else {
				xhrRequest.onload = function() {
					var statusCode = xhrRequest.status;
					var wasSuccessful = qx.util.Request.isSuccessful(statusCode);
					if(!wasSuccessful) throw new Error(qx.lang.String.format("Failed to load resource '%1'", [url]));
					result = xhrRequest.responseText;
				};
			}
			xhrRequest.open("GET", resourceUri, asynchronous);
			xhrRequest.send();
			return result;
		}
	}
});

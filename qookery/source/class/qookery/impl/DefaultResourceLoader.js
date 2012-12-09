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

qx.Class.define("qookery.impl.DefaultResourceLoader", {

	implement: [ qookery.IResourceLoader ],
	type: "singleton",
	extend: qx.core.Object,

	members: {

   		loadResource: function(url, successCallback, failCallback, options) { 
   			var resourceUri = qx.util.ResourceManager.getInstance().toUri(url);
			var xhrRequest = new qx.bom.request.Xhr();
			if(successCallback != null)
				xhrRequest.onload = function(event) {
					successCallback(xhrRequest.responseText);
				};
			xhrRequest.open("GET", (resourceUri + "?nocache=" + new Date().getTime()));
			xhrRequest.send();
   		}
	}
});

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
 * @ignore(google.*)
 */
qx.Bootstrap.define("qookery.maps.Bootstrap", {

	statics: {

		/**
		 * Option {String}: An API key as provided by Google for accessing the Google Maps Javascript API
		 */
		OPTIONS_GOOGLE_API_KEY: "q-maps:google-api-key",

		/**
		 * Option {Array}: The default map center, if none provided
		 */
		OPTIONS_DEFAULT_CENTER: "q-maps:default-center",

		/**
		 * Option {Number?6}: The default map zoom, if none provided
		 */
		OPTIONS_DEFAULT_ZOOM: "q-maps:default-zoom"
	},

	defer: function() {
		var registry = qookery.Qookery.getRegistry();
		registry.registerLibrary("googleLoader", [ "js@//www.google.com/jsapi" ]);
		registry.registerLibrary("googleMaps", null, [ "googleLoader" ], function(callback) {
			var parameters = { };
			var apiKey = qookery.Qookery.getOption(qookery.maps.Bootstrap.OPTIONS_GOOGLE_API_KEY);
			if(apiKey != null) parameters["key"] = apiKey;
			google.load("maps", "3", { other_params: qx.util.Uri.toParameter(parameters, false), callback: callback });
			return false;
		});
		registry.registerComponentType("{http://www.qookery.org/ns/Form/Maps}map-location", qookery.maps.internal.MapLocationComponent);
	}
});

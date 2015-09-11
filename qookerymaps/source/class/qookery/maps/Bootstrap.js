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

	defer: function() {
		var registry = qookery.Qookery.getRegistry();
		registry.registerLibrary("googleLoader", [ "js@//www.google.com/jsapi" ]);
		registry.registerLibrary("googleMaps", null, [ "googleLoader" ], function(callback) {
			google.load("maps", "3", { other_params: "sensor=false", callback: callback });
			return false;
		});
		registry.registerComponentType("{http://www.qookery.org/ns/Form/Maps}map-location", qookery.maps.internal.MapLocationComponent);
	}
});

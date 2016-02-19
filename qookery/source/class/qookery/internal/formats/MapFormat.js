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

qx.Class.define("qookery.internal.formats.MapFormat", {

	extend: qx.core.Object,
	implement: [ qx.util.format.IFormat ],

	construct: function(options) {
		this.base(arguments);
		var mapName = options["map"];
		this.__map = qookery.internal.Registry.getInstance().getMap(mapName);
		if(!this.__map)
			throw new Error(qx.lang.String.format("Map '%1' not registered", [ mapName ]));
	},

	members: {

		__map: null,

		format: function(key) {
			var value = this.__map[key];
			if(value === undefined) return key;
			return value;
		},

		parse: function(text) {
			return text;
		}
	}
});

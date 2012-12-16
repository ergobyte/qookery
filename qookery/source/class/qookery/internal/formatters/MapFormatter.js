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

	$Id: NumberFormatter.js 25 2012-12-09 18:00:48Z geonik@ergobyte.gr $
*/

qx.Class.define("qookery.internal.formatters.MapFormatter", {

	extend: qx.core.Object,
	implement: [qx.util.format.IFormat],
	
	construct: function(options) {
		this.base(arguments);
		this.__map = qookery.Qookery.getInstance().getRegistry().getMap(options["mapName"]) || null;
	},
	
	members: {
		
		__map: null,
		
		format: function(obj) {
			if(this.__map && this.__map[obj]) {
				return this.__map[obj];
			}
			return obj;
		},
		
		parse: function(str) {
			return str;
		}	
	}
});
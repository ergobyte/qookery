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

qx.Class.define("qookery.internal.formats.CustomFormat", {

	extend: qx.core.Object,
	implement: [ qx.util.format.IFormat ],

	construct: function(options) {
		this.base(arguments);
		if(!options) return;
		this.__formatFunction = new Function([ "value" ], options["format"]);
	},

	members: {

		__formatFunction: null,

		format: function(obj) {
			if(!this.__formatFunction) return obj;
			return this.__formatFunction.apply(this, [ obj ]);
		},

		parse: function(str) {
			throw new Error("Parsing is not supported");
		}
	}
});

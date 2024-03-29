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
		this.base(arguments, options);
		var expression = options["expression"];
		if(expression != null) {
			this.__formatFunction = new Function([ "value" ], "return(" + expression + ");");
			return;
		}
		var format = options["format"];
		if(format != null) {
			this.__formatFunction = format;
			return;
		}
		throw new Error("An expression or function must be provided");
	},

	members: {

		__formatFunction: null,

		format: function(value) {
			try {
				return this.__formatFunction(value);
			}
			catch(e) {
				this.error("Error applying custom format", e);
				return "";
			}
		},

		parse: function(text) {
			throw new Error("Parsing is not supported");
		}
	}
});

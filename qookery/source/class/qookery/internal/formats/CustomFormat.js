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
	implement: [qx.util.format.IFormat],

	construct: function(options) {
		this.base(arguments);
		if(!options) return;
		this.__thisArg = options['thisArg'];
		this.__format = options['format'];
		this.__parse = options['parse'];
	},

	members: {

		__thisArg: null,
		__format: null,
		__parse: null,

		format: function(obj) {
			if(!this.__format) return obj;
			return this.__format.call(this.__thisArg, obj);
		},

		parse: function(str) {
			if(!this.__parse) return str;
			return this.__parse.call(this.__thisArg, str);
		}
	}
});

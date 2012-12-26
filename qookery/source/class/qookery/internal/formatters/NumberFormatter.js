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

qx.Class.define("qookery.internal.formatters.NumberFormatter", {

	extend: qx.core.Object,
	implement: [qx.util.format.IFormat],

	construct: function(options) {
		this.base(arguments);
		this.__format = new qx.util.format.NumberFormat();
		this.__setOptions(options);
	},

	members: {

		__format: null,

		format: function(obj) {
			return this.__format.format(obj);
		},

		parse: function(str) {
			return this.__format.parse(str);
		},

		__setOptions: function(options) {
			for(var key in options)
				this.__setOption(key, options[key]);
		},

		__setOption: function(key, value) {
			switch(key) {
			case "postfix":
				this.__format.setPostfix(' ' + value);
				return;
			case "prefix":
				this.__format.setPrefix(value + ' ');
				return;
			case "maximumFractionDigits":
				this.__format.setMaximumFractionDigits(Number(value));
				return;
			case "minimumFractionDigits":
				this.__format.setMinimumFractionDigits(Number(value));
				return;
			case "maximumIntegerDigits":
				this.__format.setMaximumIntegerDigits(Number(value));
				return;
			case "minimumIntegerDigits":
				this.__format.setMinimumIntegerDigits(Number(value));
				return;
			default:
				this.__format.set({ key: value });
				return;
			}
		}
	}
});
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

qx.Class.define("qookery.internal.formats.NumberFormat", {

	extend: qx.util.format.NumberFormat,

	construct: function(options) {
		this.base(arguments);
		this.__setOptions(options);
	},

	members: {

		__setOptions: function(options) {
			for(var key in options)
				this.__setOption(key, options[key]);
		},

		__setOption: function(key, value) {
			switch(key) {
			case "groupingUsed":
				this.setGroupingUsed(!!value);
				return;
			case "prefix":
				this.setPrefix(value);
				return;
			case "postfix":
				this.setPostfix(value);
				return;
			case "fractionDigits": // Shorthand for setting both min and max
				this.setMinimumFractionDigits(parseInt(value));
				this.setMaximumFractionDigits(parseInt(value));
				return;
			case "minimumFractionDigits":
				this.setMinimumFractionDigits(parseInt(value));
				return;
			case "maximumFractionDigits":
				this.setMaximumFractionDigits(parseInt(value));
				return;
			case "integerDigits": // Shorthand for setting both min and max
				this.setMinimumIntegerDigits(parseInt(value));
				this.setMaximumIntegerDigits(parseInt(value));
				return;
			case "minimumIntegerDigits":
				this.setMinimumIntegerDigits(parseInt(value));
				return;
			case "maximumIntegerDigits":
				this.setMaximumIntegerDigits(parseInt(value));
				return;
			}
		}
	}
});

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
 * Extend this class if you want to create a new component that bind a value.
 */
qx.Class.define("qookery.internal.util.DefaultCellRenderer", {

	extend: qx.ui.table.cellrenderer.Abstract,

	statics: {
		cssKeys: {
			"text-align": null,
			"color": null,
			"font-style": null,
			"font-weight": null,
			"line-height": null,
			"white-space": null
		}
	},

	construct: function(column) {
		this.base(arguments);
		this.__column = column;
	},

	members: {

		__column: null,
		__format: null,

		getFormat: function() {
			return this.__format;
		},

		setFormat: function(format) {
			this.__format = format;
		},

		_getContentHtml: function(cellInfo) {
			var text = this._formatValue(cellInfo);
			return qx.bom.String.escape(text);
		},

		_formatValue: function(cellInfo) {
			var value = cellInfo.value;
			if(value == null) return "";
			if(this.__format) return this.__format.format(value);
			return value.toString();
		},

		_getCellStyle: function(cellInfo) {
			var style = [];
			for(var key in this.constructor.cssKeys) {
				var value = this.__column[key];
				if(!value) value = this.constructor.cssKeys[key];
				if(!value) continue;
				style.push(key, ":", value, ";");
			}
			return style.join("");
		}
	}
});

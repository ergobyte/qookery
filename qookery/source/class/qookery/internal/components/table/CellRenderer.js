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

qx.Class.define("qookery.internal.components.table.CellRenderer", {

	extend: qx.ui.table.cellrenderer.Abstract,

	statics: {

		CSS_KEYS: [
			"text-align", "color", "font-family", "font-style", "font-weight", "line-height", "white-space"
		]
	},

	construct: function(column) {
		this.base(arguments);
		this.__column = column;
		this.__format = column["format"] ? qookery.Qookery.getRegistry().createFormat(column["format"]) : null;
		this.__map = column["map"] ? qookery.Qookery.getRegistry().getMap(column["map"]) : null;
	},

	members: {

		__column: null,
		__format: null,
		__map: null,

		_getContentHtml: function(cellInfo) {
			var text = this._formatValue(cellInfo);
			return qx.bom.String.escape(text);
		},

		_formatValue: function(cellInfo) {
			var value = cellInfo.value;
			if(value == null) return "";
			if(this.__format) value = this.__format.format(value);
			if(this.__map) value = Object.ifNull(this.__map[value], value);
			return qookery.Qookery.getService("ModelProvider").getLabel(value, "short");
		},

		_getCellStyle: function(cellInfo) {
			var column = this.__column;
			return this.constructor.CSS_KEYS.reduce(function(cellStyle, key) {
				var value = column[key];
				if(value != null)
					cellStyle += key + ":" + value + ";";
				return cellStyle;
			}, "");
		}
	},

	destruct: function() {
		this._disposeObjects("__format");
	}
});

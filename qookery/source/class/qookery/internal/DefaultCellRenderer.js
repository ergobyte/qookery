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

/**
 * Extend this class if you want to create a new component that bind a value. 
 */
qx.Class.define("qookery.internal.DefaultCellRenderer", {
	
	extend: qx.ui.table.cellrenderer.Abstract,
	
	construct: function(align, color, style, weight, wrap) {
		this.base(arguments);
		this.__defaultTextAlign = align || "";
		this.__defaultColor = color || "";
		this.__defaultFontStyle = style || "";
		this.__defaultFontWeight = weight || "";
		this.__wrap = wrap ? "normal" : "nowrap";
	},
	
	members: {
		
		__formatter: null,
		__defaultTextAlign: null,
		__defaultColor: null,
		__defaultFontStyle: null,
		__defaultFontWeight: null,
		__wrap: null,
		__verticalAlign: null,
		__lineHeight: null,
	
		_getContentHtml: function(cellInfo) {
			return qx.bom.String.escape(this._formatValue(cellInfo));
		},
	
		_formatValue: function(cellInfo) {
			var value = cellInfo.value;
			if(value == null) return "";
			if(this.__formatter)
				return this.__formatter.format(value);
			return value.toString();
		},
		
		setFormatter: function(formatter) {
			this.__formatter = formatter;
		},
			
		_getCellStyle : function(cellInfo) {

			var style = {
				"text-align": this.__defaultTextAlign,
				"color": this.__defaultColor,
				"font-style": this.__defaultFontStyle,
				"font-weight": this.__defaultFontWeight,
				"white-space": this.__wrap
			};
			var styleString = [];
			for(var key in style) {
				if (style[key])
					styleString.push(key, ":", style[key], ";");
			}
			return styleString.join("");
		}
	}
});
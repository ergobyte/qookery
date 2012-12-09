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
	
	members: {
		
		__formatter: null,
	
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
		}
	}
});
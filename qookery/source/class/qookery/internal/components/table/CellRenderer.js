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
			"text-align", "color", "font-family", "font-size", "font-style", "font-weight", "line-height", "white-space"
		]
	},

	construct: function(component, column) {
		this.base(arguments);
		this.__column = column;
		this.__component = component;
		this.__format = column["format"] != null ? qookery.Qookery.getRegistry().createFormat(column["format"]) : null;
		this.__map = column["map"] != null ? qookery.Qookery.getRegistry().getMap(column["map"]) : null;
		var styleActionName = column["cell-renderer-callback"] || null;
		if(styleActionName != null && !component.isActionSupported(styleActionName))
			throw new Error(qx.lang.String.format("Cell render callback '%1' is not supported by component '%2'", [ styleActionName, component.toString() ]));
		else
			this.__styleActionName = styleActionName;
	},

	members: {

		__column: null,
		__format: null,
		__map: null,
		__styleActionName: null,
		__component: null,

		_getContentHtml: function(cellInfo) {
			var text = this._formatValue(cellInfo);
			return qookery.util.Xml.escape(text);
		},

		_formatValue: function(cellInfo) {
			var value = cellInfo.value;
			if(value == null)
				return "";
			if(this.__format != null) try {
				value = this.__format.format(value);
			}
			catch(e) {
				this.warn("Error formatting cell value", e);
			}
			if(this.__map != null) {
				var mappedValue = this.__map[value];
				if(mappedValue != null)
					value = mappedValue;
			}
			var modelProvider = this.__component.getForm().getModelProvider();
			var label = modelProvider.getLabel(value, "short");
			return label != null ? label : "";
		},

		_getCellStyle: function(cellInfo) {
			var column = this.__column;

			var style = qookery.internal.components.table.CellRenderer.CSS_KEYS.reduce(function(cellStyle, key) {
				var value = column[key];
				if(value != null)
					cellStyle[key] = value;
				return cellStyle;
			}, { });

			if(this.__styleActionName != null) {
				var result = this.__component.executeAction(this.__styleActionName, cellInfo);
				if(result != null)
					qx.lang.Object.mergeWith(style, result, true);
			}

			return qookery.internal.components.table.CellRenderer.CSS_KEYS.reduce(function(cellStyle, key) {
				var value = style[key];
				if(value != null)
					cellStyle += key + ":" + value + ";";
				return cellStyle;
			}, "");
		},

		getColumn: function() {
			return this.__column;
		}
	},

	destruct: function() {
		this._disposeObjects("__format");
	}
});

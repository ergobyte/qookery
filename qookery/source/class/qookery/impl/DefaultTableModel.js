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

qx.Class.define("qookery.impl.DefaultTableModel", {

	extend: qx.core.Object,
	implement: qx.ui.table.ITableModel,

	construct: function(component, formParser, xmlElement) {
		this.base(arguments);
		this.__component = component;
		this.__data = [];
	},

	events: {
		"dataChanged": "qx.event.type.Data",
		"metaDataChanged": "qx.event.type.Event",
		"sorted": "qx.event.type.Data"
	},

	members: {

		__component: null,
		__data: null,

		// .	Component
		
		updateMetadata: function() {
			this.fireEvent("metaDataChanged");
		},
		
		updateData: function(data) {
			this.__data = (data instanceof qx.data.Array) ? data.toArray() : data;
			if(this.hasListener("dataChanged")) {
				this.fireDataEvent("dataChanged", {
					firstColumn: 0,
					lastColumn: this.getColumnCount(),
					firstRow: 0,
					lastRow: -1
				});
			}
		},

		// .	Columns
		
		getColumn: function(columnIndex) {
			return this.__component.getColumns()[columnIndex];
		},
		
		getColumns: function() {
			return this.__component.getColumns();
		},
		
		getColumnCount: function() {
			return this.getColumns().length;
		},
		
		getColumnId: function(columnIndex) {
			return columnIndex.toString();
		},
		
		getColumnIndexById: function(columnId) {
			return parseInt(columnId);
		},
		
		getColumnName: function(columnIndex) {
			return this.getColumn(columnIndex)['label'];
		},

		isColumnEditable: function(columnIndex) {
			return false;
		},

		isColumnSortable: function(columnIndex) {
			return false;
		},
		
		// .	Rows

		getRowCount: function() {
			return this.__data.length;
		},
		
		getRowData: function(rowIndex) {
			return this.__data[rowIndex];
		},
		
		// .	Cells
		
		getValue: function(columnIndex, rowIndex) {
			var row = this.getRowData(rowIndex);
			if(!row) return null;
			var column = this.getColumn(columnIndex);
			if(!column) return null;
			var connect = column['connect'];
			if(!connect) return null;
			return qx.data.SingleValueBinding.resolvePropertyChain(row, connect);
		},
		
		setValue: function(columnIndex, rowIndex, value) {
			var row = this.getRowData(rowIndex);
			if(!row) return null;
			var column = this.getColumn(columnIndex);
			if(!column) return null;
			var connect = column['connect'];
			if(!connect) return null;
			// Property paths are not supported yet
			row.set(connect, value);
			if(this.hasListener("dataChanged")) {
				this.fireDataEvent("dataChanged", {
					firstColumn: columnIndex,
					lastColumn: columnIndex,
					firstRow: rowIndex,
					lastRow: rowIndex
				});
			}
		},
		
		getValueById: function(columnId, rowIndex) {
			return this.getValue(this.getColumnIndexById(columnId), rowIndex);
		},
		
		setValueById: function(columnId, rowIndex, value) {
			this.setValue(this.getColumnIndexById(columnId), rowIndex, value);
		},
		
		// .	Sorting

		sortByColumn: function(columnIndex, ascending) {
			// Not implemented yet
		},
		
		getSortColumnIndex : function() {
			return -1;
		},
		
		isSortAscending: function() {
			return false;
		},
		
		// .	Misc
		
		prefetchRows: function(firstRowIndex, lastRowIndex) {
			// Nothing to prefetch
		}
	}
});

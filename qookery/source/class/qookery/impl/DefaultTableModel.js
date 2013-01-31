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

	statics: {

		nullAccessor: {
			getLength: function(data) {
				return 0;
			},
			getRowData: function(data, index) {
				return null;
			},
			appendRow: function(data, rowData) {
				return false;
			},
			replaceRow: function(data, index, rowData) {
				return false;
			},
			removeRow: function(data, index) {
				return false;
			}
		},

		jsArrayAccessor: {
			getLength: function(data) {
				return data.length;
			},
			getRowData: function(data, index) {
				return data[index];
			},
			appendRow: function(data, rowData) {
				data.push(rowData);
				return true;
			},
			replaceRow: function(data, index, rowData) {
				data[index] = rowData;
				return true;
			},
			removeRow: function(data, index) {
				qx.lang.Array.removeAt(data, index);
				return true;
			}
		},

		qxDataArrayAccessor: {
			getLength: function(data) {
				return data.getLength();
			},
			getRowData: function(data, index) {
				return data.getItem(index);
			},
			appendRow: function(data, rowData) {
				data.push(rowData);
				return true;
			},
			replaceRow: function(data, index, rowData) {
				data.setItem(index, rowData);
				return true;
			},
			removeRow: function(data, index) {
				data.removeAt(index);
				return true;
			}
		}
	},

	construct: function(component, formParser, xmlElement) {
		this.base(arguments);
		this.__component = component;
		this.__accessor = this.self(arguments).nullAccessor;
	},

	events: {
		"dataChanged": "qx.event.type.Data",
		"metaDataChanged": "qx.event.type.Event",
		"sorted": "qx.event.type.Data"
	},

	members: {

		__component: null,
		__data: null,
		__accessor: null,

		// .	Component

		setData: function(data) {
			if(data instanceof qx.data.Array)
				this.__accessor = this.constructor.qxDataArrayAccessor;
			else if(qx.lang.Type.isArray(data))
				this.__accessor = this.constructor.jsArrayAccessor;
			else
				this.__accessor = this.constructor.nullAccessor;
			this.__data = data;
			this.reloadData();
		},
		
		reloadData: function() {
			if(!this.hasListener("dataChanged")) return;
			this.fireDataEvent("dataChanged", {
				firstColumn: 0,
				lastColumn: this.getColumnCount() - 1,
				firstRow: 0,
				lastRow: this.getRowCount() - 1
			});
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
			return this.__accessor.getLength(this.__data);
		},

		getRowData: function(rowIndex) {
			return this.__accessor.getRowData(this.__data, rowIndex);
		},

		// .	Row editing

		appendRow: function(rowData) {
			if(!this.__accessor.appendRow(this.__data, rowData)) return;
			this.fireDataEvent("dataChanged", {
				firstColumn: 0,
				lastColumn: this.getColumnCount() - 1,
				firstRow: this.getRowCount() - 2,
				lastRow: this.getRowCount() - 1
			});
		},

		replaceRow: function(rowIndex, rowData) {
			if(!this.__accessor.replaceRow(this.__data, rowIndex, rowData)) return;
			this.fireDataEvent("dataChanged", {
				firstColumn: 0,
				lastColumn: this.getColumnCount() - 1,
				firstRow: rowIndex,
				lastRow: rowIndex + 1
			});
		},

		removeRow: function(rowIndex) {
			if(!this.__accessor.removeRow(this.__data, rowIndex)) return;
			this.fireDataEvent("dataChanged", {
				firstColumn: 0,
				lastColumn: this.getColumnCount() - 1,
				firstRow: rowIndex,
				lastRow: this.getRowCount() - 1
			});
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

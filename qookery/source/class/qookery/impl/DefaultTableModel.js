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
			insertRow: function(data, index, rowData) {
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
				var rowData = data[index];
				if(rowData === undefined) return null;
				return rowData;
			},
			appendRow: function(data, rowData) {
				data.push(rowData);
				return true;
			},
			replaceRow: function(data, index, rowData) {
				data[index] = rowData;
				return true;
			},
			insertRow: function(data, index, rowData) {
				qx.lang.Array.insertAt(data, rowData, index);
				return false;
			},
			removeRow: function(data, index) {
				return qx.lang.Array.removeAt(data, index);
			}
		},

		qxDataArrayAccessor: {
			getLength: function(data) {
				return data.getLength();
			},
			getRowData: function(data, index) {
				var rowData = data.getItem(index);
				if(rowData === undefined) return null;
				return rowData;
			},
			appendRow: function(data, rowData) {
				data.push(rowData);
				return true;
			},
			replaceRow: function(data, index, rowData) {
				data.setItem(index, rowData);
				return true;
			},
			insertRow: function(data, index, rowData) {
				data.insertAt(index, rowData);
				return false;
			},
			removeRow: function(data, index) {
				return data.removeAt(index);
			}
		}
	},

	construct: function(component) {
		this.base(arguments);
		this.__component = component;
		this.__accessor = this.self(arguments).nullAccessor;
		this.__sortColumnIndex = -1;
	},

	events: {
		"dataChanged": "qx.event.type.Data",
		"metaDataChanged": "qx.event.type.Event",
		"sorted": "qx.event.type.Data"
	},

	members: {

		// Fields

		__component: null,
		__data: null,
		__accessor: null,
		__sortColumnIndex: null,
		__sortAscending: null,

		// ITableModel implementation

		// .	Component

		setData: function(data) {
			if(data instanceof qx.data.Array)
				this.__accessor = this.self(arguments).qxDataArrayAccessor;
			else if(qx.lang.Type.isArray(data))
				this.__accessor = this.self(arguments).jsArrayAccessor;
			else
				this.__accessor = this.self(arguments).nullAccessor;
			this.__data = data;
			var sortColumn = this.getColumn(this.__sortColumnIndex);
			if(sortColumn)
				this.__sortData(sortColumn, this.__sortAscending);
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
			return parseInt(columnId, 10);
		},

		getColumnName: function(columnIndex) {
			return this.getColumn(columnIndex)["label"] || "";
		},

		isColumnEditable: function(columnIndex) {
			if(columnIndex == null) return false;
			if(this.__component.getReadOnly()) return false;
			var editable = this.getColumn(columnIndex)["editable"];
			return editable !== undefined ? editable : false;
		},

		isColumnSortable: function(columnIndex) {
			if(columnIndex == null) return false;
			var sortable = this.getColumn(columnIndex)["sortable"];
			return sortable !== undefined ? sortable : true;
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
			var row = this.__accessor.removeRow(this.__data, rowIndex);
			if(row == null) return;
			this.fireDataEvent("dataChanged", {
				firstColumn: 0,
				lastColumn: this.getColumnCount() - 1,
				firstRow: rowIndex,
				lastRow: this.getRowCount() - 1
			});
			return row;
		},

		moveRowUp: function(rowIndex) {
			if(rowIndex <= 0) return false;
			var rowData = this.__accessor.removeRow(this.__data, rowIndex);
			if(!rowData) return false;
			var insertPosition = rowIndex - 1;
			this.__accessor.insertRow(this.__data, insertPosition, rowData);
			this.fireDataEvent("dataChanged", {
				firstColumn: 0,
				lastColumn: this.getColumnCount() - 1,
				firstRow: insertPosition,
				lastRow: insertPosition + 1
			});
			return true;
		},

		moveRowDown: function(rowIndex) {
			var length = this.__accessor.getLength(this.__data);
			if(rowIndex >= length - 1) return false;
			var rowData = this.__accessor.removeRow(this.__data, rowIndex);
			if(!rowData) return false;
			var insertPosition = rowIndex + 1;
			this.__accessor.insertRow(this.__data, insertPosition, rowData);
			this.fireDataEvent("dataChanged", {
				firstColumn: 0,
				lastColumn: this.getColumnCount() - 1,
				firstRow: insertPosition - 1,
				lastRow: insertPosition
			});
			return true;
		},

		// .	Cells

		getValue: function(columnIndex, rowIndex) {
			var row = this.getRowData(rowIndex);
			if(row == null) return null;
			var column = this.getColumn(columnIndex);
			if(column == null) return null;
			return this.__readCellValue(column, row);
		},

		setValue: function(columnIndex, rowIndex, value) {
			var row = this.getRowData(rowIndex);
			if(row == null) return;
			var column = this.getColumn(columnIndex);
			if(column == null) return;
			var modified = this.__writeCellValue(column, row, value);
			if(!modified) return;
			this.fireDataEvent("dataChanged", {
				firstColumn: columnIndex,
				lastColumn: columnIndex,
				firstRow: rowIndex,
				lastRow: rowIndex
			});
		},

		getValueById: function(columnId, rowIndex) {
			return this.getValue(this.getColumnIndexById(columnId), rowIndex);
		},

		setValueById: function(columnId, rowIndex, value) {
			this.setValue(this.getColumnIndexById(columnId), rowIndex, value);
		},

		// .	Sorting

		sortByColumn: function(columnIndex, ascending) {
			var column = this.getColumn(columnIndex);
			if(!column) throw new Error("Column to sort does not exist");
			this.__sortColumnIndex = columnIndex;
			this.__sortAscending = ascending;
			this.__sortData(column, ascending);
			this.fireDataEvent("sorted", {
				columnIndex: columnIndex,
				ascending: ascending
			});
			this.fireEvent("metaDataChanged");
		},

		getSortColumnIndex : function() {
			return this.__sortColumnIndex;
		},

		isSortAscending: function() {
			return this.__sortAscending;
		},

		// .	Misc

		prefetchRows: function(firstRowIndex, lastRowIndex) {
			// Nothing to prefetch
		},

		// Internals

		__sortData: function(column, ascending) {
			if(!this.__data) return;
			var modelProvider = this.__component.getForm().getModelProvider();
			this.__data.sort(function(row1, row2) {
				var value1 = this.__readCellValue(column, row1);
				var value2 = this.__readCellValue(column, row2);
				var comparison = modelProvider.compare(value1, value2);
				var signum = ascending ? 1 : -1;
				return signum * comparison;
			}.bind(this));
		},

		__hasProperty: function(row, propertyName) {
			if(!row || !row.classname) return false;
			var clazz = qx.Class.getByName(row.classname);
			if(!clazz) return false;
			return !!qx.Class.getByProperty(clazz, propertyName);
		},

		/**
		 * Read a cell's value, attempting a number of methods in sequence
		 *
		 * <ol>
		 * <li>In case a dot appears in the connection specification, resolve as a QX property chain</li>
		 * <li>In case the row is a qx.lang.Object with a properly named property, get its value</li>
		 * <li>In case a getter method is available, invoke it</li>
		 * <li>Fallback to direct reading of the JavaScript object key</li>
		 * </ol>
		 *
		 * @return {any} the cell's value or <code>null</code> if not available
		 */
		__readCellValue: function(column, row) {
			// The read function, once computed, could be cached in the column definition to improve performance
			var specification = column["connect"];
			if(specification == null)
				return null;
			var value;
			if(specification.indexOf(".") !== -1) {
				value = qx.data.SingleValueBinding.resolvePropertyChain(row, specification);
			}
			else if(this.__hasProperty(row, specification)) {
				value = row.get(specification);
			}
			else if(qx.lang.Type.isFunction(row["get" + qx.lang.String.firstUp(specification)])) {
				value = row["get" + qx.lang.String.firstUp(specification)]();
			}
			else {
				value = row[specification];
			}
			if(value == null) return null;
			var mapName = column["map"];
			if(mapName) {
				var map = qookery.Qookery.getRegistry().getMap(mapName);
				if(map) return map[value];
			}
			return value;
		},

		/**
		 * Write a cell's value, attempting a number of methods in sequence
		 *
		 * <ol>
		 * <li>In case the row is a qx.lang.Object with a properly named property, set its value</li>
		 * <li>In case a setter method is available, invoke it</li>
		 * <li>Fallback to direct writing of the JavaScript object key</li>
		 * </ol>
		 *
		 * @return {Boolean} <code>true</code> if cell's value was modified
		 */
		__writeCellValue: function(column, row, value) {
			var specification = column["connect"];
			if(specification == null) {
				return false;
			}
			if(specification.indexOf(".") !== -1) {
				this.warn("Writing value of columns with property paths is not supported yet");
				return false;
			}
			if(this.__hasProperty(row, specification)) {
				row.set(specification, value);
			}
			else if(qx.lang.Type.isFunction(row["set" + qx.lang.String.firstUp(specification)])) {
				row["set" + qx.lang.String.firstUp(specification)](value);
			}
			else {
				row[specification] = value;
			}
			return true;
		}
	}
});

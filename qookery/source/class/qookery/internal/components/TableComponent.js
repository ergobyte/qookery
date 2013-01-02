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

qx.Class.define("qookery.internal.components.TableComponent", {

	extend: qookery.internal.components.EditableComponent,

	statics: {

		columnAttributeTypes: {
			"label": "TranslatableString",
			"sortable": "Boolean",
			"width": "Size",
			"min-width": "Size",
			"max-width": "Size",
			"wrap": "Boolean"
		}
	},

	events: {
		"changeSelection": "qx.event.type.Data",
		"dataChanged": "qx.event.type.Data"
	},

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
		this.__columns = [ ];
	},

	properties: {
		value: { refine: true, init: [] }
	},

	members: {

		__columns: null,
		__tableModel: null,
		__selectedRowIndex: null,

		_createMainWidget: function(attributes) {
			var table = new qx.ui.table.Table(null, {
				tableColumnModel: function(table) {
					return new qx.ui.table.columnmodel.Resize(table);
				}
			});
			table.getSelectionModel().addListener('changeSelection', function(e) {
				var selectionModel = e.getTarget();
				var selectionRanges = selectionModel.getSelectedRanges();
				if(selectionRanges.length == 0) {
					this.__selectedRowIndex = null;
					this.fireDataEvent("changeSelection", null);
					return;
				}
				this.__selectedRowIndex = selectionRanges[0].minIndex;
				this.fireDataEvent("changeSelection", this.__tableModel.getItem(this.__selectedRowIndex));
			}, this);

			this._applyLayoutAttributes(table, attributes);
			if(attributes['row-height']) table.setRowHeight(attributes['row-height']);
			if(attributes["column-visibility-button-visible"] !== undefined) table.setColumnVisibilityButtonVisible(attributes["column-visibility-button-visible"]);
			if(attributes["status-bar-visible"] !== undefined) table.setStatusBarVisible(attributes["status-bar-visible"]);
			return table;
		},
		
		parseCustomElement: function(formParser, xmlElement) {
			var elementName = qx.dom.Node.getName(xmlElement);
			switch(elementName) {
			case "table-column":
				this.__columns.push(formParser.parseAttributes(this, this.self(arguments).columnAttributeTypes, xmlElement));
				return true;
			case "table-model":
				var modelClassName = formParser.getAttribute(xmlElement, "class");
				var modelClass = qx.Class.getByName(modelClassName);
				this.__tableModel = new modelClass(formParser, this, xmlElement);
				this.__tableModel.setTable(this);
				this.__tableModel.addListener("dataChanged", function(event) {
					this.fireDataEvent("dataChanged", event.getData());
				}, this);
				return true;
			}
			return false;
		},

		initialize: function(options) {
			if(!options) options = { };
			if(this.__columns.length == 0) {
				this.__columns = options["columns"];
			}
			if(!this.__tableModel) {
				this.__tableModel = options["model"] || new qookery.impl.DefaultTableModel();
				this.__tableModel.setTable(this);
				this.__tableModel.addListener("dataChanged", function(event) {
					this.fireDataEvent("dataChanged", event.getData());
				}, this);
			}
		},
		
		setup: function(attributes) {
			if(this.__columns.length == 0)
				throw new Error("Table must have at least one column");
			if(!this.__tableModel)
				throw new Error("Table must have a table model set");
			var nameArray = new Array();
			var labelArray = new Array();
			for(var i = 0; i < this.__columns.length; i++) {
				var column = this.__columns[i];
				nameArray.push(column["connect"]);
				labelArray.push(column["label"]);
			}
			this.__tableModel.setColumns(labelArray, nameArray);
			this.getMainWidget().setTableModel(this.__tableModel);
			var columnModel = this.getMainWidget().getTableColumnModel();
			var resizeBehavior = columnModel.getBehavior();
			for(var i = 0; i < this.__columns.length; i++) {
				var column = this.__columns[i];
				var cellRenderer = new qookery.internal.DefaultCellRenderer(column);
				if(column["width"]) resizeBehavior.setWidth(i, isNaN(column["width"]) ? column["width"] : parseInt(column["width"]));
				if(column["min-width"]) resizeBehavior.setMinWidth(i, column["min-width"]);
				if(column["max-width"]) resizeBehavior.setMaxWidth(i, column["max-width"]);
				if(column["formatter"]) {
					var formatter = this._createFormatter(column["formatter"]);
					cellRenderer.setFormatter(formatter);
				}
				columnModel.setDataCellRenderer(i, cellRenderer);
			}
		},

		getRow: function(rowIndex) {
			return this.__tableModel.getItem(rowIndex);
		},

		addRow: function(newRowModel) {
			this.getValue().push(newRowModel);
			this.__tableModel.addRowsAsMapArray([ newRowModel ], this.getValue().length - 1);
		},

		removeRow: function(rowIndex) {
			this.__tableModel.removeRows(rowIndex, 1);
			this.getValue().removeAt(rowIndex);
		},

		replaceRow: function(rowIndex, newModel) {
			this.__tableModel.setRowsAsMapArray([ newModel ], rowIndex);
			this.getValue().setItem(rowIndex, newModel);
			this.fireDataEvent("changeSelection", newModel);
		},

		getTableModel: function() {
			return this.__tableModel;
		},

		getSelectedRowIndex: function() {
			return this.__selectedRowIndex;
		},

		getSelectedRowModel: function() {
			if(this.__selectedRowIndex == null) return null;
			return this.__tableModel.getItem(this.__selectedRowIndex);
		},

		getColumnOptions: function(columnIndex) {
			return this.__columns[columnIndex];
		},

		reloadData: function() {
			this.__tableModel.reloadData();
			this.getMainWidget().getSelectionModel().resetSelection();
		},

		_applyValue: function(value) {
			this.__tableModel.setDataAsMapArray(value);
			if(this.getValue().length == 0)
				this.fireDataEvent("changeSelection", null);
		}
	},

	destruct: function() {
		this._disposeObjects("__tableModel");
	}
});

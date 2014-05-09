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

qx.Class.define("qookery.internal.components.TableComponent", {

	extend: qookery.internal.components.EditableComponent,

	events: {
		"changeSelection": "qx.event.type.Data"
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
				this.fireDataEvent("changeSelection", this.getTableModel().getRowData(this.__selectedRowIndex));
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
			case "table-model":
				var tableModelClassName = formParser.getAttribute(xmlElement, "class");
				var tableModelClass = qx.Class.getByName(tableModelClassName);
				this.__tableModel = new tableModelClass(this, formParser, xmlElement);
				return true;
			case "table-column":
				var column = formParser.parseAttributes(this, xmlElement);
				this.addColumn(column);
				return true;
			}
			return false;
		},

		getAttributeType: function(attributeName) {
			switch(attributeName) {
			case "flex": return "Integer";
			case "header-click": return "ReplaceableString";
			case "header-icon": return "String";
			case "sortable": return "Boolean";
			default: return this.base(arguments, attributeName);
			}
		},

		getTableModel: function() {
			return this.__tableModel;
		},

		setTableModel: function(tableModel) {
			this.__tableModel = tableModel;
		},

		addColumn: function(column) {
			this.__columns.push(column);
		},

		getColumns: function() {
			return this.__columns;
		},

		setColumns: function(columns) {
			this.__columns = columns;
		},

		setup: function(attributes) {
			if(this.__columns.length == 0)
				throw new Error("Table must have at least one column");
			var tableModel = this.getTableModel();
			if(!tableModel)
				throw new Error("Table must have a table model set");
			var table = this.getMainWidget();
			if(tableModel && tableModel.setup && typeof(tableModel.setup) == "function") {
				// Give model a chance to perform last minute changes
				tableModel.setup(table);
			}
			table.setTableModel(tableModel);
			var columnModel = table.getTableColumnModel();
			var resizeBehavior = columnModel.getBehavior();
			for(var i = 0; i < this.__columns.length; i++) {
				var column = this.__columns[i];
				if(column["width"] || column["flex"]) {
					var width = isNaN(column["width"]) ? column["width"] : parseInt(column["width"], 10);
					var flex = column["flex"];
					resizeBehavior.setWidth(i, width, flex);
				}
				if(column["min-width"]) {
					resizeBehavior.setMinWidth(i, column["min-width"]);
				}
				if(column["max-width"]) {
					resizeBehavior.setMaxWidth(i, column["max-width"]);
				}

				var cellRenderer = new qookery.internal.DefaultCellRenderer(column);
				if(column["format"]) {
					var format = qookery.Qookery.getRegistry().createFormatSpecification(column["format"]);
					cellRenderer.setFormat(format);
				}
				if(column["header-icon"]) {
					var headerWidget = table.getPaneScroller(0).getHeader().getHeaderWidgetAtColumn(i);
					headerWidget.setIcon(column["header-icon"]);
				}
				if(column["header-click"]) {
					var headerWidget = table.getPaneScroller(0).getHeader().getHeaderWidgetAtColumn(i);
					headerWidget.addListener("click", function(event) {
						column["header-click"](event);
					});
				}
				columnModel.setDataCellRenderer(i, cellRenderer);
			}
			this.base(arguments, attributes);
		},

		getSelectedRowIndex: function() {
			return this.__selectedRowIndex;
		},

		getSelectedRowData: function() {
			if(this.__selectedRowIndex == null) return null;
			return this.getTableModel().getRowData(this.__selectedRowIndex);
		},

		_updateUI: function(value) {
			// Setting the model data requires some cooperation from the model implementation
			var tableModel = this.getTableModel();
			if(tableModel && tableModel.setData && typeof(tableModel.setData) == "function") {
				tableModel.setData(value);
			}
		},

		addEventHandler: function(eventName, clientCode) {
			switch(eventName) {
			case "dataChanged":
				this.__tableModel.addListener("dataChanged", function(event) {
					this.executeClientCode(clientCode, { "event": event });
				}, this);
				return;
			}
			this.base(arguments, eventName, clientCode);
		}
	},

	destruct: function() {
		this.__columns.length = 0;
		this._disposeObjects("__tableModel", "__paneHeader");
	}
});

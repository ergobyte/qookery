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
		value: { refine: true, init: [ ] }
	},

	members: {

		__columns: null,
		__tableModel: null,

		// Metadata

		getAttributeType: function(attributeName) {
			switch(attributeName) {
			case "column-visibility-button-visible": return "Boolean";
			case "editable": return "Boolean";
			case "flex": return "Integer";
			case "header-cells-visible": return "Boolean";
			case "header-click": return "ReplaceableString";
			case "header-icon": return "String";
			case "row-height": return "Number";
			case "show-cell-focus-indicator": return "Boolean";
			case "sortable": return "Boolean";
			case "status-bar-visible": return "Boolean";
			default: return this.base(arguments, attributeName);
			}
		},

		// Creation

		_createMainWidget: function(attributes) {
			var table = new qx.ui.table.Table(null, {
				tableColumnModel: function(_table) {
					return new qx.ui.table.columnmodel.Resize(_table);
				}
			});
			var selectionMode;
			switch(this.getAttribute("selection-mode", "single")) {
			case "none": selectionMode = qx.ui.table.selection.Model.NO_SELECTION; break;
			case "single": selectionMode = qx.ui.table.selection.Model.SINGLE_SELECTION; break;
			case "single-interval": selectionMode = qx.ui.table.selection.Model.SINGLE_INTERVAL_SELECTION; break;
			case "multiple-interval": selectionMode = qx.ui.table.selection.Model.MULTIPLE_INTERVAL_SELECTION; break;
			case "multiple-interval-toggle": selectionMode = qx.ui.table.selection.Model.MULTIPLE_INTERVAL_SELECTION_TOGGLE; break;
			}
			var selectionModel = table.getSelectionModel();
			selectionModel.setSelectionMode(selectionMode);
			selectionModel.addListener("changeSelection", function(event) {
				var isSingleSelection = event.getTarget().getSelectionMode() === qx.ui.table.selection.Model.SINGLE_SELECTION;
				var eventData = isSingleSelection ? this.getSingleSelection() : this.getSelection();
				this.fireDataEvent("changeSelection", eventData);
			}, this);

			this._applyLayoutAttributes(table, attributes);
			if(attributes["column-visibility-button-visible"] !== undefined)
				table.setColumnVisibilityButtonVisible(attributes["column-visibility-button-visible"]);
			if(attributes["row-height"] !== undefined)
				table.setRowHeight(attributes["row-height"]);
			if(attributes["status-bar-visible"] !== undefined)
				table.setStatusBarVisible(attributes["status-bar-visible"]);
			if(attributes["show-cell-focus-indicator"] !== undefined)
				table.setShowCellFocusIndicator(attributes["show-cell-focus-indicator"]);
			if(attributes["header-cells-visible"] !== undefined)
				table.setHeaderCellsVisible(attributes["header-cells-visible"]);
			return table;
		},

		parseXmlElement: function(elementName, xmlElement) {
			switch(elementName) {
			case "{http://www.qookery.org/ns/Form}table-model":
				if(this.__tableModel) throw new Error("Table model has already been created");
				var tableModelClassName = qookery.util.Xml.getAttribute(xmlElement, "class");
				var tableModelClass = qx.Class.getByName(tableModelClassName);
				this.__tableModel = new tableModelClass(this, xmlElement);
				return true;
			case "{http://www.qookery.org/ns/Form}table-column":
				var column = qookery.util.Xml.parseAllAttributes(this, xmlElement);
				this.addColumn(column);
				return true;
			}
			return false;
		},

		setup: function(attributes) {
			if(this.__columns.length == 0)
				throw new Error("Table must have at least one column");
			var table = this.getMainWidget();
			var tableModel = this.getTableModel();
			if(qx.lang.Type.isFunction(tableModel["setup"])) {
				// Give model a chance to perform last minute changes
				tableModel["setup"].call(tableModel, table, this.__columns);
			}
			table.setTableModel(tableModel);
			var columnModel = table.getTableColumnModel();
			var resizeBehavior = columnModel.getBehavior();
			for(var i = 0; i < this.__columns.length; i++) {
				var column = this.__columns[i];
				if(column["visibility"] == "excluded") continue;
				if(column["width"] != null || column["flex"] != null) {
					var width = column["width"];
					if(width == null)
						width = undefined;
					else if(qx.lang.Type.isNumber(width))
						;
					else if(qx.lang.Type.isString(width)) {
						if(width.endsWith("*") || width.endsWith("%"))
							;
						else
							width = parseInt(width, 10);
					}
					else
						throw new Error("Illegal value set as column width");
					var flex = column["flex"];
					if(flex == null)
						flex = undefined;
					else if(qx.lang.Type.isNumber(flex))
						;
					else if(qx.lang.Type.isString(flex))
						flex = parseInt(flex, 10);
					else
						throw new Error("Illegal value set as column flex");
					resizeBehavior.setWidth(i, width, flex);
				}
				if(column["min-width"]) {
					resizeBehavior.setMinWidth(i, column["min-width"]);
				}
				if(column["max-width"]) {
					resizeBehavior.setMaxWidth(i, column["max-width"]);
				}

				var headerWidget = table.getPaneScroller(0).getHeader().getHeaderWidgetAtColumn(i);
				if(column["header-icon"]) {
					headerWidget.setIcon(column["header-icon"]);
				}
				if(column["tool-tip-text"]) {
					headerWidget.setToolTipText(column["tool-tip-text"]);
				}
				if(column["header-click"]) {
					headerWidget.addListener("tap", function(event) {
						column["header-click"](event);
					});
				}
				if(column["text-align"]) {
					headerWidget.getChildControl("label").setTextAlign(column["text-align"]);
				}

				var cellRendererName = this.resolveQName(column["cell-renderer"] || "{http://www.qookery.org/ns/Form}model");
				var cellRendererFactory = qookery.Qookery.getRegistry().get(qookery.IRegistry.P_CELL_RENDERER_FACTORY, cellRendererName, true);
				var cellRenderer = cellRendererFactory(this, column);
				columnModel.setDataCellRenderer(i, cellRenderer);
				if(column["visibility"] == "hidden") {
					columnModel.setColumnVisible(i, false);
				}
			}
			this.base(arguments, attributes);
		},

		// Public methods

		getTableModel: function() {
			if(this.__tableModel == null)
				this.__tableModel = new qookery.impl.DefaultTableModel(this);
			return this.__tableModel;
		},

		setTableModel: function(tableModel) {
			if(this.__tableModel != null) this.__tableModel.dispose();
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

		isSelectionEmpty: function() {
			var selectionModel = this.getMainWidget().getSelectionModel();
			return selectionModel.isSelectionEmpty();
		},

		getSelection: function() {
			var selection = [ ];
			if(!this.__tableModel) return selection;
			var selectionModel = this.getMainWidget().getSelectionModel();
			selectionModel.iterateSelection(function(rowIndex) {
				var rowData = this.__tableModel.getRowData(rowIndex);
				if(rowData !== null) selection.push(rowData);
			}, this);
			return selection;
		},

		resetSelection: function() {
			this.getMainWidget().getSelectionModel().resetSelection();
		},

		getSingleSelection: function() {
			var selection = this.getSelection();
			if(selection.length !== 1) return null;
			return selection[0];
		},

		getSelectedRowIndex: function() {
			var selectedRowIndex = null;
			this.getMainWidget().getSelectionModel().iterateSelection(function(rowIndex) {
				selectedRowIndex = rowIndex;
			});
			return selectedRowIndex;
		},

		setSelectedRowIndex: function(rowIndex, setFocus) {
			this.getMainWidget().getSelectionModel().setSelectionInterval(rowIndex, rowIndex);
			if(setFocus) this.getMainWidget().setFocusedCell(0, rowIndex, true);
		},

		selectAll: function() {
			this.getMainWidget().getSelectionModel().setSelectionInterval(0, this.getTableModel().getRowCount() - 1);
		},

		// Component overrides

		_updateUI: function(value) {
			// Setting the model data requires some cooperation from the model implementation
			var tableModel = this.getTableModel();
			if(tableModel && tableModel.setData && typeof(tableModel.setData) == "function") {
				tableModel.setData(value);
			}
		},

		addEventHandler: function(eventName, handler, onlyOnce) {
			switch(eventName) {
			case "dataChanged":
				var methodName = onlyOnce ? "addListenerOnce" : "addListener";
				this.getTableModel()[methodName]("dataChanged", handler, this);
				return;
			}
			this.base(arguments, eventName, handler, onlyOnce);
		},

		_applyValid: function() {
			// Overriden in order to prevent default handling
		},

		_applyRequired: function() {
			// Overriden in order to prevent default handling
			// TODO Qookery: Add a validator that checks that table is not empty
		}
	},

	destruct: function() {
		this.__columns.length = 0;
		this._disposeObjects("__tableModel");
	}
});

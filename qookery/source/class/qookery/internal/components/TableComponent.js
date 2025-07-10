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

	construct(parentComponent) {
		super(parentComponent);
		this.__columns = [ ];
	},

	properties: {
		value: { refine: true, init: [ ] }
	},

	members: {

		__columns: null,
		__tableModel: null,

		// Metadata

		getAttributeType(attributeName) {
			switch(attributeName) {
			case "column-visibility-button-visible": return "Boolean";
			case "editable": return "Boolean";
			case "flex": return "Integer";
			case "header-cells-visible": return "Boolean";
			case "header-icon": return "String";
			case "row-height": return "Number";
			case "show-cell-focus-indicator": return "Boolean";
			case "sortable": return "Boolean";
			case "status-bar-visible": return "Boolean";
			default: return super(attributeName);
			}
		},

		// Creation

		_createMainWidget() {
			let table = new qx.ui.table.Table(null, {
				tableColumnModel: _table => {
					return new qx.ui.table.columnmodel.Resize(_table);
				}
			});
			let selectionMode;
			switch(this.getAttribute("selection-mode", "single")) {
			case "none": selectionMode = qx.ui.table.selection.Model.NO_SELECTION; break;
			case "single": selectionMode = qx.ui.table.selection.Model.SINGLE_SELECTION; break;
			case "single-interval": selectionMode = qx.ui.table.selection.Model.SINGLE_INTERVAL_SELECTION; break;
			case "multiple-interval": selectionMode = qx.ui.table.selection.Model.MULTIPLE_INTERVAL_SELECTION; break;
			case "multiple-interval-toggle": selectionMode = qx.ui.table.selection.Model.MULTIPLE_INTERVAL_SELECTION_TOGGLE; break;
			}
			let selectionModel = table.getSelectionModel();
			selectionModel.setSelectionMode(selectionMode);
			selectionModel.addListener("changeSelection", event => {
				let isSingleSelection = event.getTarget().getSelectionMode() === qx.ui.table.selection.Model.SINGLE_SELECTION;
				let eventData = isSingleSelection ? this.getSingleSelection() : this.getSelection();
				this.fireDataEvent("changeSelection", eventData);
			});

			this._applyWidgetAttributes(table);
			this._applyAttribute("column-visibility-button-visible", table, "columnVisibilityButtonVisible");
			this._applyAttribute("row-height", table, "rowHeight");
			this._applyAttribute("status-bar-visible", table, "statusBarVisible");
			this._applyAttribute("show-cell-focus-indicator", table, "showCellFocusIndicator");
			this._applyAttribute("header-cells-visible", table, "headerCellsVisible");
			return table;
		},

		parseXmlElement(elementName, xmlElement) {
			switch(elementName) {
			case "{http://www.qookery.org/ns/Form}table-model":
				if(this.__tableModel)
					throw new Error("Table model has already been created");
				let tableModelClassName = qookery.util.Xml.getAttribute(xmlElement, "class", Error);
				let tableModelClass = qx.Class.getByName(tableModelClassName);
				this.__tableModel = new tableModelClass(this, xmlElement);
				return true;
			case "{http://www.qookery.org/ns/Form}table-column":
				let column = qookery.util.Xml.parseAllAttributes(this, xmlElement);
				for(let e of qx.dom.Hierarchy.getChildElements(xmlElement)) {
					if(qx.dom.Node.getName(e) === "script") {
						let name = qookery.util.Xml.getAttribute(e, "name", Error);
						if(name === "format") {
							let clientCode = qookery.util.Xml.getNodeText(e);
							column["format"] = value => this.executeClientCode(clientCode, { value: value });
						}
					}
				}
				this.addColumn(column);
				return true;
			}
			return false;
		},

		setup() {
			if(this.__columns.length === 0)
				throw new Error("Table must have at least one column");
			let table = this.getMainWidget();
			let tableModel = this.getTableModel();
			if(qx.lang.Type.isFunction(tableModel["setup"])) {
				// Give model a chance to perform last minute changes
				tableModel["setup"](table, this.__columns);
			}
			table.setTableModel(tableModel);
			let columnModel = table.getTableColumnModel();
			let resizeBehavior = columnModel.getBehavior();
			for(let i = 0; i < this.__columns.length; i++) {
				let column = this.__columns[i];
				if(column["visibility"] == "excluded")
					continue;
				if(column["width"] != null || column["flex"] != null) {
					let width = column["width"];
					if(width == null)
						width = undefined;
					else if(qx.lang.Type.isNumber(width))
						;
					else if(qx.lang.Type.isString(width)) {
						if(!(width.endsWith("*") || width.endsWith("%")))
							width = parseInt(width, 10);
					}
					else
						throw new Error("Illegal value set as column width");
					let flex = column["flex"];
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

				let headerRenderer = column["header-icon"] != null ?
						new qx.ui.table.headerrenderer.Icon(column["header-icon"]) :
						new qx.ui.table.headerrenderer.Default();
				columnModel.setHeaderCellRenderer(i, headerRenderer);
				if(column["tool-tip-text"]) {
					headerRenderer.setToolTip(column["tool-tip-text"]);
				}
				if(column["cell-editor"]) {
					let cellEditorName = this.resolveQName(column["cell-editor"]);
					let cellEditorFactory = qookery.Qookery.getRegistry().get(qookery.IRegistry.P_CELL_EDITOR_FACTORY, cellEditorName, true);
					let cellEditor = cellEditorFactory(this, column);
					columnModel.setCellEditorFactory(i, cellEditor);
				}

				let cellRendererName = this.resolveQName(column["cell-renderer"] || qookery.Qookery.getOption(qookery.Qookery.OPTION_DEFAULT_CELL_RENDERER, "{http://www.qookery.org/ns/Form}model"));
				let cellRendererFactory = qookery.Qookery.getRegistry().get(qookery.IRegistry.P_CELL_RENDERER_FACTORY, cellRendererName, true);
				let cellRenderer = cellRendererFactory(this, column);
				columnModel.setDataCellRenderer(i, cellRenderer);
				if(column["visibility"] == "hidden") {
					columnModel.setColumnVisible(i, false);
				}
			}
			super();
		},

		// Public methods

		getTableModel() {
			if(this.__tableModel == null)
				this.__tableModel = new qookery.impl.DefaultTableModel(this);
			return this.__tableModel;
		},

		setTableModel(tableModel) {
			if(this.__tableModel != null)
				this.__tableModel.dispose();
			this.__tableModel = tableModel;
		},

		addColumn(column) {
			this.__columns.push(column);
		},

		getColumns() {
			return this.__columns;
		},

		setColumns(columns) {
			this.__columns = columns;
		},

		isSelectionEmpty() {
			let selectionModel = this.getMainWidget().getSelectionModel();
			return selectionModel.isSelectionEmpty();
		},

		getSelection() {
			let selection = [ ];
			if(!this.__tableModel)
				return selection;
			let selectionModel = this.getMainWidget().getSelectionModel();
			selectionModel.iterateSelection(rowIndex => {
				let rowData = this.__tableModel.getRowData(rowIndex);
				if(rowData !== null)
					selection.push(rowData);
			});
			return selection;
		},

		resetSelection() {
			this.getMainWidget().getSelectionModel().resetSelection();
		},

		getSingleSelection() {
			let selection = this.getSelection();
			return selection.length !== 1 ? null : selection[0];
		},

		getSelectedRowIndex() {
			let selectedRowIndex = null;
			this.getMainWidget().getSelectionModel().iterateSelection(rowIndex => {
				selectedRowIndex = rowIndex;
			});
			return selectedRowIndex;
		},

		setSelectedRowIndex(rowIndex, setFocus) {
			this.getMainWidget().getSelectionModel().setSelectionInterval(rowIndex, rowIndex);
			if(setFocus)
				this.getMainWidget().setFocusedCell(0, rowIndex, true);
		},

		selectAll() {
			this.getMainWidget().getSelectionModel().setSelectionInterval(0, this.getTableModel().getRowCount() - 1);
		},

		readColumnState(columnModel, columnStates) {
			if(columnStates == null)
				return;
			let columns = this.getColumns();
			let positions = new Array(columns.length);
			for(let columnState of columnStates) {
				let columnIndex = -1;
				for(let i = 0; i < columns.length; i++) {
					if(columns[i]["name"] === columnState["name"])
						columnIndex = i;
				}
				if(columnIndex === -1)
					return;
				columnModel.setColumnVisible(columnIndex, columnState["visible"] !== false);
				let position = columnState["position"];
				if(position >= 0 && position < positions.length && positions[position] == null)
					positions[position] = columnIndex;
			}
			for(let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
				if(positions.some(index => index === columnIndex))
					continue;
				for(let i = 0; i < positions.length; i++) {
					if(positions[i] != null)
						continue;
					positions[i] = columnIndex;
					break;
				}
			}
			columnModel.setColumnsOrder(positions);
		},

		writeColumnState(columnModel) {
			let columns = this.getColumns();
			return columns.reduce((array, column, index) => {
				let columnName = column["name"];
				if(columnName != null) array.push({
					name: columnName,
					position: columnModel.getOverallX(index),
					visible: columnModel.isColumnVisible(index)
				});
				return array;
			}, [ ]);
		},

		// Component overrides

		_updateUI(value) {
			// Setting the model data requires some cooperation from the model implementation
			let tableModel = this.getTableModel();
			if(tableModel && tableModel.setData && typeof tableModel.setData == "function") {
				tableModel.setData(value);
			}
		},

		addEventHandler(eventName, handler, onlyOnce) {
			switch(eventName) {
			case "dataChanged":
				let methodName = onlyOnce ? "addListenerOnce" : "addListener";
				this.getTableModel()[methodName]("dataChanged", handler, this);
				return;
			}
			super(eventName, handler, onlyOnce);
		},

		_applyValid() {
			// Overriden in order to prevent default handling
		},

		_applyRequired() {
			// Overriden in order to prevent default handling
			// TODO Qookery: Add a validator that checks that table is not empty
		}
	},

	destruct() {
		this.__columns.length = 0;
		this._disposeObjects("__tableModel");
	}
});

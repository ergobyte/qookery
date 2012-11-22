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
	
	events: {
		"changeSelection" : "qx.event.type.Data"
	},

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},
	
	properties: {
		value: { refine: true, init: [] }
	},

	members: {

		__tableModel: null,
		__selectedRowIndex: null,
		
		initialize: function(options) {
			if(!options || (!options["model"] && !options["columns"])) return;
			this.__tableModel = options["model"] || new qookery.impl.SimpleTableModel();
			this.__tableModel.setTable(this);
			if(options["columns"]) {
				var nameArray = new Array();
				var labelArray = new Array();
				for(var column in options["columns"]) {
					nameArray.push(options["columns"][column]["connect"]);
					labelArray.push(options["columns"][column]["label"]);
				}
				this.__tableModel.setColumns(labelArray, nameArray);
			}
			this._widgets[0].setTableModel(this.__tableModel);
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
		
		reloadData: function() {
			this.__tableModel.reloadData();
			this.getMainWidget().getSelectionModel().resetSelection();
		},
		
		_createMainWidget: function(createOptions) {
			var widget = new qx.ui.table.Table();
			widget.getSelectionModel().addListener('changeSelection', function(e) {
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

			this._applyLayoutProperties(widget, createOptions);
			return widget;
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

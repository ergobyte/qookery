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

	extend: qookery.internal.components.BaseComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	properties: {
		items: { nullable: true, init: [], event: "itemsChanged" }
	},

	members: {

		__tableModel: null,
		__propertyPath: null,
		_lastRowSelected: null,
		
		create: function(createOptions) {
			this._widgets[0] = new qx.ui.table.Table();
			this._widgets[0].addListener("cellClick", function(event) {
				this._lastRowSelected = event.getRow();
			},this);
			this._applyLayoutProperties(this._widgets[0], createOptions);
			
			this.addListener("itemsChanged", function(event) {
				if(this.__propertyPath != null) {
					var data = this.getForm().getModel();
					var getterName = "get" + qx.lang.String.firstUp(this.__propertyPath);
					data = data[getterName]();
					this.__tableModel.populate(data);
				}
			}, this);
			
			this.base(arguments, createOptions);
		},

		connect: function(controller, propertyPath ) {
			controller.addTarget(this, "items", propertyPath, true);
			this.__propertyPath = propertyPath;
		},

		getLabel: function() {
			return null;
		},

		setLabel: function() {
			// TODO Label on top of the table 
		},
		
		getValue: function(columnIndex, rowIndex) {
			var model = this._widgets[0].getTableModel();
			return model.getValue(columnIndex, rowIndex);
		},

		getModel: function() {
			return this.__tableModel;
		},

		getLastRowSelected: function() {
			return this._lastRowSelected;
		},

		setColumns: function(columns) {
			this.__tableModel.setColumns(columns);
		},

		setVisible: function(visibility) {
			if(visibility == true)
				this._widgets[0].show();
			else if(visibility == false)
				this._widgets[0].hide();
		},

		setModel: function(tableModel) {
			if(this.__tableModel != null) {
				this.__tableModel.dispose();
			}
			this.__tableModel = tableModel;
			this._widgets[0].setTableModel(tableModel);
			
			if(tableModel instanceof waffle.ui.internal.TableSimpleModel) { 
				// TODO Find another way
				this.bind("items", this.__tableModel, "waffleItems");
				this.__tableModel.bind("waffleItems", this, "items");
			}
		},

		getSelection: function() {
			var selection = [];
			this._widgets[0].getSelectionModel().iterateSelection(function(id) {
				selection.push(id);
			});
			return selection;
		},

		setMultySelection: function(selection) {
			if(selection)
				this._widgets[0].getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.MULTIPLE_INTERVAL_SELECTION);
			else
				this._widgets[0].getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
		},
		
		disableFraction: function(columnId) {
			var tcm = this._widgets[0].getTableColumnModel();
			var cellRenderer = new qx.ui.table.cellrenderer.Number();
			var numberFormat = new qx.util.format.NumberFormat();
			numberFormat.set({
				maximumFractionDigits : 0,
				groupingUsed : false
			});
			cellRenderer.setNumberFormat(numberFormat);
			tcm.setDataCellRenderer(columnId, cellRenderer);
		}
	},

	destruct: function() {
		if(this.__tableModel != null)
			this.__tableModel.dispose();
	}
});

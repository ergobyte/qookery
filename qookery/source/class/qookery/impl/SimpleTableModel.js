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

qx.Class.define("qookery.impl.SimpleTableModel", {

	extend: qx.ui.table.model.Simple,

	construct: function() {
		this.base(arguments);
	},
	
	members: {

   		// Simple model implementations
		
		__table: null,
		
		setData: function(data) {
			var newData = (data instanceof qx.data.Array) ? data.toArray() : data;
			this.base(arguments, newData);
		},
		
		setDataAsMapArray: function(data) {
			var newData = (data instanceof qx.data.Array) ? data.toArray() : data;
			this.base(arguments, newData);
		},
		
		setTable: function(table) {
			this.__table = table;
		},
		
		getItem: function(rowIndex) {
			return this.__table.getValue().getItem(rowIndex);
		},
		
		reloadData: function() {
			;//Implement if you want to reload model data.
		},
			
		_mapArray2RowArr : function(mapArr, rememberMaps) {
			var rowCount = mapArr.length;
			var columnCount = this.getColumnCount();
			var dataArr = new Array(rowCount);
			for(var i=0; i<rowCount; ++i) {
				var columnArr = [];
				if(rememberMaps)
					columnArr.originalData = mapArr[i];
				for(var j=0; j<columnCount; ++j)
					columnArr[j] = this.__readEntity(mapArr[i], this.getColumnId(j));
				dataArr[i] = columnArr;
			}
			return dataArr;
   		},

   		// Internal stuff
   		
		__getGetterName: function(property) {
			return "get" + qx.lang.String.firstUp(property);
		},
			
		__readEntity: function(entity, property) {
			var getterName = this.__getGetterName(property);
			return entity[getterName]();
		}
	}
});


qx.Class.define("qookery.impl.DefaultTableModel", {
 
 	extend : qx.core.Object,
 	implement : qx.ui.table.ITableModel,

	events :
  	{
		/**
		 * Fired when the table data changed (the stuff shown in the table body).
		 * The data property of the event will be a map having the following
		 * attributes:
		 * <ul>
		 *   <li>firstRow: The index of the first row that has changed.</li>
		 *   <li>lastRow: The index of the last row that has changed.</li>
		 *   <li>firstColumn: The model index of the first column that has changed.</li>
		 *   <li>lastColumn: The model index of the last column that has changed.</li>
		 * </ul>
		 *
		 * Additionally, if the data changed as a result of rows being removed
		 * from the data model, then these additional attributes will be in the
		 * data:
		 * <ul>
		 *   <li>removeStart: The model index of the first row that was removed.</li>
		 *   <li>removeCount: The number of rows that were removed.</li>
		 * </ul>
		 */
  		"dataChanged" : "qx.event.type.Data",

		/**
		 * Fired when the meta data changed (the stuff shown in the table header).
		 */
		"metaDataChanged" : "qx.event.type.Event",

		/**
		 * Fired after the table is sorted (but before the metaDataChanged event)
		 */
		"sorted" : "qx.event.type.Data"
    },

	construct : function() {
	
		this.base(arguments);
		this.__columnIdArr = {};
		this.__columnNameArr = {};
		this.__columnIndexMap = {};
		this.__rowData = [];
	},

	members : {
    
    	__columnIdArr: null,
    	__columnNameArr : null,
    	__columnIndexMap : null,
    	__rowData: null,
    	
		getColumnCount : function() {
			return qx.lang.Object.getLength(this.__columnIndexMap);
		},
		
		getColumnId : function(columnIndex) {
			return this.__columnIdArr[columnIndex];
		},
		
		getColumnIndexById : function(columnId) {
			return this.__columnIndexMap[columnId];
		},

		getColumnName : function(columnIndex) {
			return this.__columnNameArr[columnIndex];
		},

		getRowCount : function() {
			return this.__rowData.length;
		},

		getRowData : function(rowIndex) {
			//TODO
			return null;
		},
		
		getSortColumnIndex : function() {
			//TODO
			return -1;
		},
		
		getValue : function(columnIndex, rowIndex) {
			var key = this.__columnIdArr[columnIndex];
			return this.getValueById(key, rowIndex);
		},

		getValueById : function(columnId, rowIndex) {
			var item = this.__rowData[rowIndex];
			return this.__readEntity(item, columnId);
		},

		isColumnEditable : function(columnIndex) {
			//TODO
			return false;
		},

		isColumnSortable : function(columnIndex) {
			//TODO
			return false;
		},
		
		isSortAscending : function() {
			//TODO
			return true;
		},
		
		prefetchRows : function(firstRowIndex, lastRowIndex) {
			//TODO
		},

		/**
		 * Abstract method
		 *
		 * @param columnIndex {Integer} index of the column
		 * @param rowIndex {Integer} index of the row
		 * @param value {var} Value to be set
		 *
		 * @throws {Error} An error if this method is called.
		 */
		setValue : function(columnIndex, rowIndex, value) {
		 	var key = this.__columnIdArr[columnIndex];
		 	this.setValueById(key, rowIndex, value);
		},

		setValueById : function(columnId, rowIndex, value) {
			var item = this.__rowData[rowIndex];
			this.__writeEntity(item, columnId, value);
		},
		
		sortByColumn : function(columnIndex, ascending) {
			//TODO
		},
		
		//////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////// METHODS ///////////////////////////////////
		//////////////////////////////////////////////////////////////////////////////////
		
		__getGetterName: function(property) {
			return "get" + qx.lang.String.firstUp(property);
		},
		
		__readEntity: function(entity, property) {
			var getterName = this.__getGetterName(property);
			return entity[getterName]();
		},
		
		__getSetterName: function(property) {
			return "set" + qx.lang.String.firstUp(property);
		},
		
		__writeEntity: function(entity, property, value) {
			var setterName = this.__setGetterName(property);
			entity[setterName](value);
		},
		
		setColumns: function(columns) {
			for (var i = 0; i < columns.length; i++) {
				var item = columns[i];
				this.addColumn(item["label"], item["property"]);
			}
			this.fireEvent("metaDataChanged");
		},
		
		addColumn: function(header, propertyPath) {
			if (propertyPath == "" || propertyPath == null) {
				propertyPath = header;
			}
			var index = qx.lang.Object.getLength(this.__columnIndexMap);
			this.__columnNameArr[index] = header;
			this.__columnIdArr[index] = propertyPath;
			this.__columnIndexMap[propertyPath] = (index);
		},
		
		setData: function(data) {
			this.__rowData = data.toArray();
			
			// Inform the listeners
			if (this.hasListener("dataChanged"))
			{
				var eventData =
				{
					firstRow    : 0,
					lastRow     : data.length - 1,
					firstColumn : 0,
					lastColumn  : this.getColumnCount() - 1
				};
			
				this.fireDataEvent("dataChanged", eventData);
			}
		}

	},

	destruct : function() {
		this.__columnIdArr = this.__columnNameArr = this.__columnIndexMap = null;
	}
	
});
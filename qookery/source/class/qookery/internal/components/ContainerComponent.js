/**
 * Base class for components that are containers of other components
 */
qx.Class.define("qookery.internal.components.ContainerComponent", {
	
	type : "abstract",
	extend: qookery.internal.components.BaseComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
		this._currentRow = 0;
		this._currentColumn = 0;
		this._grabHorizontal = false;
		this._numOfColumns = null;
		this._layout = null;
		this._labelColumn =  null;
	},

	members: {

		_numOfColumns: null,
		_layout: null,
		_currentRow: 0,
		_currentColumn: 0,
		_labelColumn: null,
		_grabHorizontal: false,

		setup: function() {
			var controls = this.getMainWidget().getChildren();
			var layout = this.getMainWidget().getLayout();
			for(var i=0; i < controls.length; i++) {
				
				if ( controls[i] instanceof qx.ui.basic.Label ) {
					this._labelColumn = this._currentColumn;
					layout.setColumnFlex(this._currentColumn, 0);
				}
				
				if(this._labelColumn != this._currentColumn)
					layout.setColumnFlex(this._currentColumn, 3);

				var createOptions = controls[i].getUserData('qookeryComponent').getCreateOptions();
				if(createOptions['horizontalSpan'] != null && createOptions['horizontalSpan'] != '') {
					controls[i].setLayoutProperties({
						row: this._currentRow, 
						column: this._currentColumn, 
						colSpan: parseInt(createOptions['horizontalSpan'])
					});
					this._currentColumn += parseInt(createOptions['horizontalSpan']) - 1;
				}
				else if(controls[i] instanceof qx.ui.form.CheckBox) {
					controls[i].setLayoutProperties({
						row: this._currentRow, 
						column: this._currentColumn
					});
				
					this._currentColumn++;
				}
				else {
					controls[i].setLayoutProperties({ row: this._currentRow, column: this._currentColumn });
				}
				
				if(++this._currentColumn >= this._numOfColumns) {
					this._currentRow++;
					this._currentColumn = 0;
				}
			}
		},

		__disposeChildren: function() {
			var controls = this.getMainWidget().getChildren();
			if(controls.length == 0) return;
			for(var i=0; i < controls.length; i++) {
				if ( !controls[i].isDisposed() ) {
					var thatControl = controls[i].getUserData('qookeryComponent');
					thatControl.dispose();
				}
			}
		}
	},

	destruct: function() {
		this.__disposeChildren();
		this._numOfColumns = null;
		this._layout = null;
		this._currentRow = null;
		this._currentColumn = null;
		this._labelColumn = null;
		this._grabHorizontal = null;
	}
});

/**
 * Base class for components that are containers of other components
 */
qx.Class.define("qookery.internal.components.ContainerComponent", {
	
	type : "abstract",
	extend: qookery.internal.components.BaseComponent,
	implement: [ qookery.IContainerComponent ],

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
		this.__children = [ ];
		this._currentRow = 0;
		this._currentColumn = 0;
		this._grabHorizontal = false;
		this._numOfColumns = null;
		this._layout = null;
		this._labelColumn =  null;
	},

	members: {

		__children: null,
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
				
				if(controls[i] instanceof qx.ui.basic.Label) {
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
		
		listChildren: function() {
			return this.__children;
		},

		/**
		 * Add a component as a child of this component
		 * 
		 * @param childComponent {qookery.IComponent} the component to add to this component
		 * 
		 * @throw an exception is thrown in case this component does not support children
		 */
		addChild: function(childComponent) {
			this.__children.push(childComponent);
			var widgets = childComponent.listWidgets();
			for(var i = 0; i < widgets.length; i++) {
				this.getMainWidget().add(widgets[i]);
			}
		}
	},

	destruct: function() {
		this._disposeArray("__children");
		this._layout = null;
		this._labelColumn = null;
	}
});

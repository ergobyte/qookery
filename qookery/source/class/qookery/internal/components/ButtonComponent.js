
qx.Class.define("qookery.internal.components.ButtonComponent", {

	extend: qookery.internal.components.BaseComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);	
	},

	members:{
		create: function(createOptions) {
			this._widgets[0] = new qx.ui.form.Button(
				createOptions['label'], 
				createOptions['icon']
			);
			this._setupWidgetAppearance(this._widgets[0], createOptions);
			this.base(arguments, createOptions);
		},

		setValue: function(buttonLabelValue) {
			this.getMainWidget().setLabel(buttonLabelValue);	
		},

		setCommand: function(codeToExecute){
			this._widgets[0].setCommand(codeToExecute);
		},

		execute: function() {
			this._widgets[0].execute();
		}
	},
	
	destruct: function() {
		this._widgets[0].removeAllBindings(); // Just to be sure
	}
});

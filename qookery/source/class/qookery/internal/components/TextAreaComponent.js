
qx.Class.define("qookery.internal.components.TextAreaComponent", {
	
	extend: qookery.internal.components.EditableComponent,
	
	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},
	
	members: {
	
		create: function(createOptions) {
			this._labelWidget = new qx.ui.basic.Label(createOptions['label']);
			this._setupLabelAppearance(this._labelWidget,createOptions);
			
			this._editableWidget = new qx.ui.form.TextArea();
			this._setupWidgetAppearance(this._editableWidget,createOptions);
			
			if(createOptions['enabled'] == "false")
				this._editableWidget.setEnabled(false);
			
			this._widgets = [ this._labelWidget, this._editableWidget ];
			this.base(arguments, createOptions);
		},

		connect: function(controller, propertyPath) {
			controller.addTarget(this._editableWidget, "value", propertyPath, true);
		}
	}

});

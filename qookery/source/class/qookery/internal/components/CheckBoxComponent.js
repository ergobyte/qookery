
qx.Class.define("qookery.internal.components.CheckBoxComponent", {

	extend: qookery.internal.components.ConnectableComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members:{

		create: function(createOptions, formComponent) {
			this._widgets[0] = new qx.ui.form.CheckBox(createOptions['label']);
			this._setupLabelAppearance(this._widgets[0], createOptions);
			this.base(arguments, createOptions);
		},

		connect: function(controller, propertyPath) {
			controller.addTarget(this.getMainWidget(), "value", propertyPath, true);
		},

		getValue: function() {
			return this.getMainWidget().getValue();
		},

		setValue: function(textFieldValue) {
			this.getMainWidget().setValue(textFieldValue);	
		}
	}
});

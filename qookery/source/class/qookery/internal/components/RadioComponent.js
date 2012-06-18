
qx.Class.define("qookery.internal.components.RadioComponent", {

	extend: qookery.internal.components.ConnectableComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {
		create: function(createOptions) {
			this._widgets[0] = new qx.ui.form.RadioGroup();
			this.base(arguments, createOptions);
		}
	}
});

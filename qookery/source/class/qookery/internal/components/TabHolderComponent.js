
qx.Class.define("qookery.internal.components.TabHolderComponent", {

	extend: qookery.internal.components.ContainerComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {

		create: function(createOptions) {
			this._widgets[0] = new qx.ui.tabview.TabView();
			this.base(arguments, createOptions);
		}
	}
});

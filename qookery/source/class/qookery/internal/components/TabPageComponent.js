
qx.Class.define("qookery.internal.components.TabPageComponent", {

	extend: qookery.internal.components.ContainerComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {

		create: function(createOptions) {
			// TODO in case numOfColumns is null, find a way to caculate the num of childs
			this._widgets[0] = new qx.ui.tabview.Page(createOptions['label']);
			var layout = new qx.ui.layout.Grid();
			this._widgets[0].setLayout(layout);
			this.base(arguments, createOptions);
		}
	}
});

/**
 * Component wrapping a Qooxdoo qx.ui.container.Composite
 */
qx.Class.define("qookery.internal.components.CompositeComponent", {

	extend: qookery.internal.components.ContainerComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members:{

		create: function(createOptions) {
			// TODO in case numOfColumns is null, find a way to caculate the num of childs
			this._numOfColumns = createOptions['numOfColumns'];
			this._grabHorizontal = createOptions['grabHorizontal'] == "true";
			this._layout = new qx.ui.layout.Grid();
			this._layout.setSpacing(10);
			this._widgets[0] = new qx.ui.container.Composite(this._layout);
			this.base(arguments, createOptions);
		},
		
		hide: function() {
			this._widgets[0].hide();
		},
		
		show: function() {
			this._widgets[0].show();
		}
	}
});

qx.Class.define("qookery.internal.components.GroupComponent", {

	extend: qookery.internal.components.ContainerComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {

		create: function(createOptions) {
			// TODO if numOfColumns is null find a way to caculate the num of childs
			this._numOfColumns = createOptions['numOfColumns'];
			this._layout = new qx.ui.layout.Grid();
			this._layout.setSpacing(10);
			this._grabHorizontal = createOptions['grabHorizontal'] == "true";
			this._widgets[0] = new qx.ui.groupbox.GroupBox(createOptions['label']);
			this._widgets[0].setLayout(this._layout);
			this.base(arguments, createOptions);
		}
	},

	destruct: function(){
		
	}
});

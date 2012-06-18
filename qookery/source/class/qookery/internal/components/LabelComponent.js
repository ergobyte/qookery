
qx.Class.define("qookery.internal.components.LabelComponent", {

	extend: qookery.internal.components.ConnectableComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {

		create: function(createOptions) {
			
			if(createOptions['rich'] == "true"){
				this._widgets[0].setRich(true);
			}
			
			if(createOptions['variant'] == "separator") {
				this._widgets[0] = new qx.ui.core.Widget().set({
					decorator: "separator-horizontal",
					backgroundColor: "gray",
					height: 1
				});
			}
			else {
				this._widgets[0] = new qx.ui.basic.Label(createOptions['label']);
			}
			
			this.base(arguments, createOptions);
		},
		
		setValue: function(value) {
			if(this._createOptions['variant'] != "separator")
				this._widgets[0].setValue(value);
		},
		
		setRich: function(value) {
			if(this._createOptions['variant'] != "separator")
				this._widgets[0].setRich(value);
		}
	}
});


qx.Class.define("qookery.internal.components.PasswordComponent", {

	extend: qookery.internal.components.EditableComponent,
	
	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {
		
		create: function(createOptions) {
			this._labelWidget = new qx.ui.basic.Label(createOptions['label']);
			this._setupLabelAppearance(this._labelWidget, createOptions);
			
			this._editableWidget = new qx.ui.form.PasswordField();
			this._setupWidgetAppearance(this._editableWidget, createOptions);
			if(createOptions['disabled'] == "true")
				this._editableWidget.setEnabled(false);
		
			this._widgets = [ this._labelWidget, this._editableWidget ];
			this.base(arguments, createOptions);
		},

		connect: function(controller, propertyPath) {
			var getHumanFriendly = function(entity) {
				var labelProvider = waffle.ui.internal.WaffleLabelProvider.getInstance();
				if(labelProvider != null) {
					var humanFriendlyField = labelProvider.getLabel(entity);
					return humanFriendlyField;
				}
				else {	// if there is not label provider
					return entity;
				}
			};
			
			controller.addTarget(this._editableWidget, "value", propertyPath, true, {
				converter: getHumanFriendly
			});
		}
	}
});

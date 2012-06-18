/**
 * A date chooser component that understand ISO 8601.
 * In the near feauture will be implemented more types of date.
 */
qx.Class.define("qookery.internal.components.DateChooserComponent", {

	extend: qookery.internal.components.ConnectableComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {

		_dateChooserWidget: null,
		_labelWidget: null,

		create: function(createOptions) {
			this._labelWidget = new qx.ui.basic.Label(createOptions['label']);
			this._setupLabelAppearance(this._labelWidget, createOptions);
			
			this._dateChooserWidget = new qx.ui.form.DateField();
			
			this._setupWidgetAppearance(this._dateChooserWidget, createOptions);
			if(createOptions['disabled'] == "true")
				this._dateChooserWidget.setEnabled(false);
				
			this._widgets = [ this._labelWidget, this._dateChooserWidget ];
			this.base(arguments, createOptions);
		},

		connect: function(controller, propertyPath) {
			controller.addTarget(this._dateChooserWidget, "value", propertyPath, true);
		},

		getMainWidget: function() {
			return this._dateChooserWidget;
		},

		setValue: function(value) {
			this._dateChooserWidget.setValue(value);
		},

		setLabel: function(value) {
			this._labelWidget.setValue(value);
		},

		getLabel: function() {
			return this._labelWidget.getValue();
		},

		listWidgets: function(filterName) {
			if(filterName == "user") return [ this._dateChooserWidget ];
			return this.base(arguments, filterName);
		},

		setRequired: function(isRequired) {
			if(isRequired === true) {
				this._labelWidget.setRich(true);
				this._labelWidget.setValue(this._labelWidget.getValue()+" <b style='color:red'>*</b>");
				this._textWidget.setRequired(true);
				this.getForm().getValidationManager().add(this._textWidget);
			}
			else if(isRequired === false) {
				this.getForm().getValdationManager().remove(this._textWidget);
				this._textWidget.setRequired(false);
			}
			else {
				qx.log.Logger.error(this, "setRequired takes only boolean.");
			}
		}
	},

	destruct: function() {
		// FIXME There is no removeAllListeners for dateChooser widget ? 
		this._dateChooserWidget.removeAllBindings();
		this._dateChooserWidget.destroy();
		this._dateChooserWidget = null;
		
		this._labelWidget.removeAllBindings();
		this._labelWidget.destroy();
		this._labelWidget = null;
	}
});

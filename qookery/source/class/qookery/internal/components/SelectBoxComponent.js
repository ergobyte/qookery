/**
 * A selectBox that can be populate with complex and simple models.
 */
qx.Class.define("qookery.internal.components.SelectBoxComponent", {

	extend: qookery.internal.components.ConnectableComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {
		
		_selectBoxWidget: null,
		_labelWidget:null,
		_listController: null,
		_internalModel: null,
		
		create: function(createOptions) {
			this._selectBoxWidget = new qx.ui.form.SelectBox();
			this._setupWidgetAppearance(this._selectBoxWidget,createOptions);

			this._labelWidget = new qx.ui.basic.Label(createOptions['label']);
			this._setupLabelAppearance(this._labelWidget,createOptions);
			
			this._widgets = [ this._labelWidget, this._selectBoxWidget ];
			
			if(createOptions['enabled'] == "false")
				this._selectBoxWidget.setEnabled(false);
			
			this._listController = new qx.data.controller.List(null, null, null);
			this.base(arguments, createOptions);
		},

		getMainWidget: function() {
			return this._widgets[1];
		},

		listWidgets: function(filterName) {
			if(filterName == "user") return [ this._selectBoxWidget ];
			return this.base(arguments, filterName);
		},

		connect: function(controller, propertyPath) {
			controller.addTarget(this._listController, "selection[0]", propertyPath, true);
			controller.addListener("changeModel", function(e) {
				var getterName = "get" + qx.lang.String.firstUp(propertyPath);
				var propertyValue = controller.getModel()[getterName]();
				var protocolName = controller.getModel().getProtocol().getField(propertyPath).getValueProtocol();
				var items = this._selectBoxWidget.getSelectables(true);
				
				for(var i=0; i<items.length; i++) {
					if ( waffle.protocols.SimpleTypes.isEqual(items[i].getModel(), propertyValue, protocolName)) {
						this._selectBoxWidget.setSelection([items[i]]);
					}
				}
			}, this);
		},

		populate: function(choices) {
			// TODO WAFFLE protocols should not appear in Qookery. Find way around this travesty!
			if(qookery.Qookery.getInstance().getLabelProvider() == null) {
				qx.log.Logger.warn(this, "Please implement a labelPovider or use the function addChoices().");
				return;
			}
			var protocolName = choices[0]["@protocol"];
			var protocol = waffle.protocols.Protocols.getProtocol(protocolName);
			if(protocol == null) {
				qx.log.Logger.warn(this, "Cannot find parameter with protocol name '" + protocolName + "'. Aborting populate().");
				return;
			}
			var labelfield = protocol.getDisplayField().getName();
			var subData = new Array();
			subData.push({ label: "Select a value", data: null });
			for(var i=0; i<choices.length; i++ ) {
				var recreatedLabel = choices[i][labelfield];
				var recreatedData = waffle.protocols.Protocols.forceCreateModel(choices[i], protocolName);
				var recreatedChoice = { label:recreatedLabel, data: recreatedData };
				subData.push(recreatedChoice);
			}
			
			var model = { choices: subData };
			this._internalModel = qx.data.marshal.Json.createModel(model); // there is no problem with sub-objects.
			this._setDefaultDelegate();
			this._listController.setModel(this._internalModel.getChoices());
			this._listController.setTarget(this._selectBoxWidget);
		},

		addChoices: function(subData) {
			var model = { choices: subData };
			this._internalModel = qx.data.marshal.Json.createModel(model);
			this._setDefaultDelegate();
			this._listController.setModel(this._internalModel.getChoices());
			this._listController.setTarget(this._selectBoxWidget);
		},

		setLabel: function(value) {
			this._labelWidget.setValue(value);
		},

		getLabel: function() {
			return this._labelWidget.getValue();
		},

		setEnabled: function(enabled) {
			this._selectBoxWidget.setEnabled(enabled);
		},

		setRequired: function(isRequired) {
			if(isRequired == true) {
				this._lableWidget.setRich(true);
				this._labelWidget.setValue(this._labelWidget.getValue() + " <b style='color:red'>*</b>");
				this._selectBoxWidget.setRequired(true);
				this.getForm().getValidationManager().add(this._selectBoxWidget);
			} else if(isRequired == false) {
				this.getForm().getValdationManager().remove(this._selectBoxWidget);
				this._selectBoxWidget.setRequired(false);
			} else {
				qx.log.Logger.error(this, "setRequired takes only boolean.");
			}
		},

		// functions for internal use
		_setDefaultDelegate: function() {
			this._listController.setDelegate({
				bindItem: function(controller, item, index) {
					controller.bindProperty("label", "label", null, item, index);
					controller.bindProperty("data", "model", null, item, index);
				}
			});
		}
	},

	destruct: function() {
		this._labelWidget.destroy();
		this._labelWidget  = null;
	}
});

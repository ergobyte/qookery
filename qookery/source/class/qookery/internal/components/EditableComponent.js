/*
	Qookery - Declarative UI Building for Qooxdoo

	Copyright (c) Ergobyte Informatics S.A., www.ergobyte.gr

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

		http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.

	$Id$
*/

/**
 * Extend this class if you want to create a new component that bind a value. 
 */
qx.Class.define("qookery.internal.components.EditableComponent", {

	type: "abstract",
	implement: [ qookery.IEditableComponent ],
	extend: qookery.internal.components.BaseComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},
	
	members: {

		create: function(createOptions) {
			this._widgets[0] = this._createMainWidget(createOptions);
			this._widgets[1] = new qx.ui.basic.Label(createOptions['label']);
			this._setupLabelAppearance(this._widgets[1], createOptions);
			if(createOptions['enabled'] == false)
				this.getMainWidget().setEnabled(false);
			this.base(arguments, createOptions);
		},
		
		/**
		 * Create a two way binding
		 *	
		 * @param controller {qx.data.controller.Object} The form controller that the bindings
		 * @param path {String} The protocol path
		 */
		connect: function(controller, path) {
			throw new Error("Method not implemented");
		},

		addValidation: function(validationOptions) {
			var type = validationOptions['type'];
			if(type == null || type.length == 0) throw new Error("Validation type required");
			var message = validationOptions['message'];
			var widget = this.getMainWidget();
			var className = "qookery.internal.validators." + qx.lang.String.firstUp(type) + "Validator";
			var clazz = qx.Class.getByName(className);
			if(clazz == null) throw new Error(qx.lang.String.format("Validator class '%1' not found", [ className ]));
			var validator = new clazz(message);
			var qxValidator = new qx.ui.form.validation.AsyncValidator(validator);
			this.getForm().getValidationManager().add(widget, qxValidator);
		},

		clearValidations: function() {
			var widget = this.getMainWidget();
			this.getForm().getValidationManager().remove(widget);
		},

		_createMainWidget: function(createOptions) {
			throw new Error("Override _createMainWidget() to provide implementation specific code");
		},

		getLabelWidget: function() {
			return this._widgets[1];
		},

		getValue: function() {
			return this.getMainWidget().getValue();
		},

		setValue: function(value) {
			this.getMainWidget().setValue(value);
		},

		clearValue:function() {
			this.getMainWidget().resetValue();
		},

		getLabel: function() {
			return this.getLabelWidget().getValue();
		},

		setLabel: function(value) {
			this.getLabelWidget().setValue(value);
		},

		setToolTip: function(value) {
			this.getMainWidget().setToolTip(value);
		},

		getEnabled: function() {
			return this.getMainWidget().getEnabled();
		},

		setEnabled: function(enabled) {
			this.getMainWidget().setEnabled(enabled);
		},
		
		setVisible: function(visibility) {
			if(visibility == true)
				this.getMainWidget().show();
			else if(visibility == false)
				this.getMainWidget().hide();
			else
				qx.log.Logger.error(this, "Illegal argument for setVisible()");
		},

		setRequired: function(isRequired) {
			if(isRequired === true) {
				this.getLabelWidget().setRich(true);
				this.getLabelWidget().setValue(this.getLabelWidget().getValue()+" <b style='color:red'>*</b>");
				this.getMainWidget().setRequired(true);
				this.getForm().getValidationManager().add(this.getMainWidget());
			}
			else if(isRequired === false) {
				this.getForm().getValdationManager().remove(this.getMainWidget());
				this.getMainWidget().setRequired(false);
			}
			else {
				qx.log.Logger.error(this, "Illegal argument for setRequired()");
			}
		},

		listWidgets: function(filterName) {
			if(filterName == "main") return [ this._widgets[0] ];
			// Reverse order of main and label widget since 
			// we want to present the label in front of the editor
			return [ this._widgets[1], this._widgets[0] ];
		},
		
		// Utility methods for subclasses

		_getIdentityOf: function(value) {
			if(!value) return null;
			var modelProvider = qookery.Qookery.getInstance().getModelProvider();
			if(!modelProvider) return value.toString();
			return modelProvider.getIdentity(value);
		},
		
		_getLabelOf: function(value) {
			if(!value) return "";
			var modelProvider = qookery.Qookery.getInstance().getModelProvider();
			if(!modelProvider) return value.toString();
			var humanFriendlyField = modelProvider.getLabel(value);
			return humanFriendlyField;
		},

		/**
		 * Perform all operation about align, width and height for a label
		 * 
		 * @param widget {qx.ui.basic.Label} A label widget
		 * @param createOptions {keyValuePairList} The instruction about the label apperance
		 */
		_setupLabelAppearance: function(labelWidget, createOptions) {
			var currentWidth = labelWidget.getWidth();
			labelWidget.setMinWidth(currentWidth);
			labelWidget.setAllowStretchX(false);
			labelWidget.setAllowStretchY(true);
			labelWidget.setAlignX("left");
			labelWidget.setAlignY("middle");
		}
	}
});

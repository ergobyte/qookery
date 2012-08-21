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
	
	properties: {

		label: { check: "String", inheritable: true, nullable: true, apply: "_applyLabel" },
	    toolTip: { check: "String", inheritable: true, nullable: true, apply: "_applyToolTip" },
		required: { check: "Boolean", inheritable: true, nullable: false, init: false, apply: "_applyRequired" }
	},
	
	members: {

		create: function(createOptions) {
			this._widgets[0] = this._createMainWidget(createOptions);
			this._widgets[1] = new qx.ui.basic.Label();
			this._setupLabelAppearance(this._widgets[1], createOptions);
			if(createOptions['label']) this.setLabel(createOptions['label']);
			if(createOptions['required']) this.setRequired(true);
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
			var mainWidget = this.getMainWidget();
			var className = "qookery.internal.validators." + qx.lang.String.firstUp(type) + "Validator";
			var clazz = qx.Class.getByName(className);
			if(clazz == null) throw new Error(qx.lang.String.format("Validator class '%1' not found", [ className ]));
			var validator = new clazz(message);
			var qxValidator = new qx.ui.form.validation.AsyncValidator(validator);
			this.getForm().getValidationManager().add(mainWidget, qxValidator);
		},

		clearValidations: function() {
			var mainWidget = this.getMainWidget();
			this.getForm().getValidationManager().remove(mainWidget);
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

		clearValue: function() {
			this.getMainWidget().resetValue();
		},

		listWidgets: function(filterName) {
			if(filterName == "main") return [ this._widgets[0] ];
			// Reverse order of main and label widget since 
			// we want to present the label in front of the editor
			return [ this._widgets[1], this._widgets[0] ];
		},

		// Properties
		
		_applyLabel: function(label) {
			var labelWidget = this.getLabelWidget();
			if(labelWidget) labelWidget.setValue(label);
		},

		_applyToolTip: function(toolTip) {
			var mainWidget = this.getMainWidget();
			if(mainWidget) mainWidget.setToolTip(toolTip);
		},

		_applyRequired: function(required) {
			var mainWidget = this.getMainWidget();
			if(!mainWidget) return;
			if(required === true) {
				mainWidget.setRequired(true);
				this.getForm().getValidationManager().add(mainWidget);
			}
			else if(required === false) {
				mainWidget.setRequired(false);
				this.getForm().getValidationManager().remove(mainWidget);
			}
			else {
				qx.log.Logger.error(this, "Illegal argument for setRequired()");
			}
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
			labelWidget.setAllowStretchY(false);
			labelWidget.setAlignX("left");
			labelWidget.setAlignY("middle");
		}
	}
});

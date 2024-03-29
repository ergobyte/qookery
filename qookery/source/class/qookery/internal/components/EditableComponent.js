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
*/

/**
 * Extend this class if you want to create a new component that bind a value.
 */
qx.Class.define("qookery.internal.components.EditableComponent", {

	type: "abstract",
	implement: [ qookery.IEditableComponent ],
	extend: qookery.internal.components.Component,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
		this.__validations = [ ];
	},

	properties: {
		value: { init: null, inheritable: true, nullable: true, apply: "_applyValue", transform: "_transformValue", event: "changeValue" },
		label: { check: "String", inheritable: true, nullable: true, apply: "_applyLabel" },
		toolTipText: { check: "String", inheritable: true, nullable: true, apply: "_applyToolTipText" },
		required: { check: "Boolean", inheritable: true, nullable: false, init: false, apply: "_applyRequired" },
		readOnly: { check: "Boolean", inheritable: true, nullable: false, init: false, apply: "_applyReadOnly" },
		format: { check: "qx.util.format.IFormat", inheritable: true, nullable: true, init: null, apply: "_applyFormat", transform: "_transformFormat" },
		valid: { check: "Boolean", nullable: false, apply: "_applyValid", event: "changeValid" }
	},

	members: {

		_disableValueEvents: false,
		__validations: null,
		__requiredValidation: null,
		__connection: null,

		// Metadata

		getAttributeType: function(attributeName) {
			switch(attributeName) {
			case "create-label": return "Boolean";
			default: return this.base(arguments, attributeName);
			}
		},

		// Initialization

		create: function(attributes) {
			this.base(arguments, attributes);
			this._applyAttribute("required", this, "required", false);
			this._applyAttribute("read-only", this, "readOnly", false);
			this._applyAttribute("format", this, "format");
			this._applyAttribute("label", this, "label");
			var liveValidate = this.getAttribute("live-validate", "false");
			switch(liveValidate) {
			case "component":
				this.addListener("changeValue", function() {
					this.validate();
				}, this);
				break;
			case "form":
				this.addListener("changeValue", function() {
					this.getForm().validate();
				}, this);
				break;
			}
		},

		_createWidgets: function() {
			var mainWidget = this._createMainWidget();
			if(this.getAttribute("create-label", true)) {
				var label = new qx.ui.basic.Label();
				this._setupLabelAppearance(label);
				return [ mainWidget, label ];
			}
			return [ mainWidget ];
		},

		_createMainWidget: function() {
			throw new Error("Override _createMainWidget() to provide implementation specific code");
		},

		setup: function() {
			var connectionSpecification = this.getAttribute("connect");
			if(connectionSpecification != null) {
				this.connect(connectionSpecification);
			}
			var initializeClientCode = this.getAttribute("initialize");
			if(initializeClientCode) {
				var initialValue = this.executeClientCode(qx.lang.String.format("return (%1);", [ initializeClientCode ]));
				this.setValue(initialValue);
			}
			return this.base(arguments);
		},

		// Widget access

		listWidgets: function(filterName) {
			var mainWidget = this._widgets[0];
			if(filterName == "main") return [ mainWidget ];
			var labelWidget = this._widgets[1];
			if(!labelWidget) return [ mainWidget ];
			// Reverse order of main and label widget since
			// we want to present the label in front of the editor
			return [ labelWidget, mainWidget ];
		},

		getEditableWidget: function() {
			return this.getMainWidget();
		},

		getLabelWidget: function() {
			return this._widgets[1];
		},

		isFocusable: function() {
			var focusable = this.base(arguments);
			if(!focusable)
				return false;
			if(this.isReadOnly())
				return false;
			return true;
		},

		// Model connection and UI

		connect: function(connectionSpecification) {
			this.disconnect();
			var modelProvider = this.getForm().getModelProvider();
			if(modelProvider == null)
				throw new Error("Install a model provider to handle connections in XML forms");
			var connection = modelProvider.connectComponent(this, connectionSpecification);
			if(connection == null)
				throw new Error("Model provider failed to provide a connection");
			this._applyConnection(modelProvider, connection);
			this.__connection = connection;
		},

		disconnect: function() {
			if(this.__connection == null) return;
			this.getForm().removeConnection(this.__connection);
			this.__connection = null;
		},

		updateUI: function(value) {
			if(this._disableValueEvents || this.isDisposed())
				return false;
			if(value === undefined)
				value = this.getValue();
			this._disableValueEvents = true;
			try {
				this._updateUI(value);
				return true;
			}
			finally {
				this._disableValueEvents = false;
			}
		},

		_applyConnection: function(modelProvider, connection) {
			// Subclasses may extend or override below functionality to support more attributes
			if(this.getLabel() == null) {
				var connectionLabel = connection.getAttribute("label");
				if(connectionLabel != null)
					this.setLabel(connectionLabel);
			}
			if(this.getFormat() == null) {
				var formatSpecification = connection.getAttribute("format");
				if(formatSpecification != null)
					this.setFormat(qookery.Qookery.getRegistry().createFormat(formatSpecification));
			}
			if(this.getToolTipText() == null) {
				var toolTipText = connection.getAttribute("tool-tip-text");
				if(toolTipText != null)
					this.setToolTipText(toolTipText);
			}
		},

		_updateUI: function(value) {
			// Override to update UI according to new value
		},

		// Validation

		addValidation: function(validatorType, invalidMessage, options) {
			var validator = qookery.Qookery.getRegistry().getValidator(validatorType);
			if(!validator) throw new Error(qx.lang.String.format("Validator %1 not found", [ validatorType ]));
			if(!options) options = { };
			var validation = validator.createValidation(this, invalidMessage, options);
			this.__validations.push(validation);
			return validation;
		},

		removeValidation: function(validation) {
			qx.lang.Array.remove(this.__validations, validation);
		},

		removeAllValidations: function() {
			this.__validations.length = 0;
		},

		setInvalidMessage: function(invalidMessage) {
			var widget = this.getEditableWidget();
			if(typeof widget.setInvalidMessage !== "function") {
				this.debug("Unable to set property 'invalidMessage' of broken editable component");
				return;
			}
			widget.setInvalidMessage(invalidMessage);
		},

		validate: function() {
			var errors = this.getEnabled() ? this._runValidations() : null;
			return this._applyValidationErrors(errors);
		},

		/**
		 * Call all installed validations and return possibly empty array of discovered errors
		 */
		_runValidations: function() {
			var errors = [ ];
			for(var i = 0; i < this.__validations.length; i++) {
				var validation = this.__validations[i];
				var error = null;
				try {
					var value = this.getValue();
					error = validation.call(this, value);
				}
				catch(e) {
					if(!(e instanceof qx.core.ValidationError)) throw e; // Rethrow unknown exception
					var message = (e.message && e.message != qx.type.BaseError.DEFAULTMESSAGE) ? e.message : e.getComment();
					error = new qookery.util.ValidationError(this, message);
				}
				if(error == null) continue;
				errors.push(error);
			}
			return errors;
		},

		/**
		 * Update component state according to (possibly empty) array of validation errors
		 *
		 * @param errors {Array} array of validation errors
		 *
		 * @return {qookery.util.ValidationError} merged validation error or <code>null</code> if no errors passed
		 */
		_applyValidationErrors: function(errors) {
			if(errors == null || errors.length === 0) {
				this.setValid(true);
				return null;
			}
			var componentLabel = this.getLabel() || "";
			var message = this.tr("qookery.internal.components.EditableComponent.componentError", componentLabel);
			var error = new qookery.util.ValidationError(this, message, errors);
			this.setValid(false);
			this.setInvalidMessage(error.getFormattedMessage());
			return error;
		},

		// Apply methods

		_applyValid: function(value) {
			var widget = this.getEditableWidget();
			if(typeof widget.setValid !== "function") {
				this.debug("Unable to apply property 'valid' of broken editable component");
				return;
			}
			widget.setValid(value);
		},

		_applyFormat: function(format) {
			// Override to handle formats
		},

		_applyValue: function(value) {
			if(this.__connection != null) {
				var model = this.getForm().getModel();
				if(model != null)
					this.__connection.setModelValue(model, value);
			}
			this.updateUI(value);
		},

		_applyLabel: function(label) {
			var labelWidget = this.getLabelWidget();
			if(!labelWidget) return;
			labelWidget.setValue(label);
		},

		_applyToolTipText: function(toolTipText) {
			var mainWidget = this.getMainWidget();
			if(!mainWidget) return;
			mainWidget.setToolTipText(toolTipText);
		},

		_applyRequired: function(required) {
			var labelWidget = this.getLabelWidget();
			if(required && !this.__requiredValidation) {
				this.__requiredValidation = this.addValidation("notNull");
				if(labelWidget) labelWidget.addState("required");
			}
			if(!required && this.__requiredValidation) {
				this.removeValidation(this.__requiredValidation);
				this.__requiredValidation = null;
				if(labelWidget) labelWidget.removeState("required");
			}
		},

		_applyReadOnly: function(readOnly) {
			// Subclasses should extend this method to implement the read only property
			var labelWidget = this.getLabelWidget();
			if(labelWidget) {
				if(readOnly) labelWidget.addState("readOnly"); else labelWidget.removeState("readOnly");
			}
		},

		// Transform methods

		_transformValue: function(value) {
			// Override to transform value
			return value;
		},

		_transformFormat: function(value) {
			if(qx.lang.Type.isString(value)) {
				return qookery.Qookery.getRegistry().createFormat(value);
			}
			return value;
		},

		// Utility methods for subclasses

		/**
		 * Ask model provider to return a human friendly label for value
		 *
		 * @param value {any} the value for which a label is needed
		 * @param labelType {String?} optional symbolic name of needed label type
		 *
		 * @return {String} produced label for user interface needs
		 */
		_getLabelOf: function(value, labelType) {
			if(value == null) return "";
			var format = this.getFormat();
			if(format != null)
				return format.format(value);
			var modelProvider = this.getForm().getModelProvider();
			if(modelProvider != null)
				return modelProvider.getLabel(value, labelType);
			return qx.data.Conversion.toString(value);
		},

		/**
		 * Perform all operation about align, width and height for a label
		 *
		 * @param labelWidget {qx.ui.basic.Label} label widget
		 */
		_setupLabelAppearance: function(labelWidget) {
			var currentWidth = labelWidget.getWidth();
			labelWidget.setMinWidth(currentWidth);
			labelWidget.setAllowStretchX(false);
			labelWidget.setAllowStretchY(false);
			labelWidget.setAlignX("left");
			labelWidget.setAlignY("middle");
		},

		_setValueSilently: function(value) {
			this._disableValueEvents = true;
			try {
				this.setValue(value);
			}
			catch(e) {
				throw e;
			}
			finally {
				this._disableValueEvents = false;
			}
		}
	},

	destruct: function() {
		this.disconnect();
	}
});

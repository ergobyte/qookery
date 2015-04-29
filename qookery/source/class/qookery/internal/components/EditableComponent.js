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
	extend: qookery.internal.components.BaseComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
		this.__validations = [ ];
	},

	properties: {
		value: { init: null, inheritable: true, nullable: true, apply: "_applyValue", transform: "_transformValue", event: "changeValue" },
		label: { check: "String", inheritable: true, nullable: true, apply: "_applyLabel" },
		toolTip: { check: "String", inheritable: true, nullable: true, apply: "_applyToolTip" },
		required: { check: "Boolean", inheritable: true, nullable: false, init: false, apply: "_applyRequired" },
		readOnly: { check: "Boolean", inheritable: true, nullable: false, init: false, apply: "_applyReadOnly" },
		format: { check: "qx.util.format.IFormat", inheritable: true, nullable: true, init: null, apply: "_applyFormat", transform: "_transformFormat" },
		valid: { check: "Boolean", nullable: false, apply: "_applyValid" }
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
			this.setRequired(this.getAttribute("required", false));
			this.setReadOnly(this.getAttribute("read-only", false));
			var format = this.getAttribute("format"); if(format !== undefined) this.setFormat(format);
			var label = this.getAttribute("label"); if(label !== undefined) this.setLabel(label);
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

		_createWidgets: function(attributes) {
			var mainWidget = this._createMainWidget(attributes);
			if(attributes["label"] !== "%none" && this.getAttribute("create-label", true)) {
				var label = new qx.ui.basic.Label();
				this._setupLabelAppearance(label, attributes);
				return [ mainWidget, label ];
			}
			return [ mainWidget ];
		},

		_createMainWidget: function(attributes) {
			throw new Error("Override _createMainWidget() to provide implementation specific code");
		},

		setup: function(formParser, attributes) {
			var connectionSpecification = this.getAttribute("connect");
			if(!connectionSpecification) return;
			var modelProvider = this.getForm().getModelProvider();
			if(!modelProvider)
				throw new Error("Install a model provider to handle connections in XML forms");
			var connectionHandle = modelProvider.handleConnection(formParser, this, connectionSpecification);
			if(connectionHandle)
				this._applyConnectionHandle(modelProvider, connectionHandle);
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

		// Model connection

		connect: function(propertyPath) {
			this.disconnect();
			this.__connection = this.getForm().addConnection(this, "value", propertyPath, true);
		},

		disconnect: function() {
			if(this.__connection == null) return;
			this.getForm().removeConnection(this.__connection);
			this.__connection = null;
		},

		_applyConnectionHandle: function(modelProvider, connectionHandle) {
			// Subclasses may extend or override below functionality to support more attributes
			if(!this.getLabel()) {
				var connectionLabel = modelProvider.getConnectionAttribute(connectionHandle, "label");
				if(connectionLabel) this.setLabel(connectionLabel);
			}
			if(!this.getFormat()) {
				var connectionFormat = modelProvider.getConnectionAttribute(connectionHandle, "format");
				if(connectionFormat) this.setFormat(qookery.Qookery.getRegistry().createFormatFromSpecification(connectionFormat));
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
			if(!this.getEnabled()) return null;
			var errors = this._runValidations();
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
		 * @return {qookery.util.ValidationError} merged validation error or <code>null</code> if no errors passed
		 */
		_applyValidationErrors: function(errors) {
			if(errors == null || errors.length === 0) {
				this.setValid(true);
				return null;
			}
			else {
				var message = this.tr("qookery.internal.components.EditableComponent.componentError", this.getLabel());
				var error = new qookery.util.ValidationError(this, message, errors);
				this.setValid(false);
				this.setInvalidMessage(error.getFormattedMessage());
				return error;
			}
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
			if(this._disableValueEvents || this.isDisposed()) return;
			this._disableValueEvents = true;
			try {
				this._updateUI(value);
			}
			catch(e) {
				throw e;
			}
			finally {
				this._disableValueEvents = false;
			}
		},

		_applyLabel: function(label) {
			var labelWidget = this.getLabelWidget();
			if(!labelWidget) return;
			labelWidget.setValue(label);
		},

		_applyToolTip: function(toolTip) {
			var mainWidget = this.getMainWidget();
			if(mainWidget) mainWidget.setToolTip(toolTip);
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
			// Subclasses should override to implement the read only property
		},

		// Transform methods

		_transformValue: function(value) {
			// Override to transform value
			return value;
		},

		_transformFormat: function(value) {
			if(qx.lang.Type.isString(value)) {
				return qookery.Qookery.getRegistry().createFormatFromSpecification(value);
			}
			return value;
		},

		// Utility methods for subclasses

		/**
		 * Ask model provider to return a human friendly label for value
		 *
		 * @param value {any} the value for which a label is needed
		 *
		 * @return {String} produced label for user interface needs
		 */
		_getLabelOf: function(value) {
			if(!value) return "";
			var format = this.getFormat();
			if(format) return format.format(value);
			var modelProvider = qookery.Qookery.getModelProvider();
			if(modelProvider) return modelProvider.getLabel(value).toString();
			return value.toString();
		},

		/**
		 * Perform all operation about align, width and height for a label
		 *
		 * @param widget {qx.ui.basic.Label} A label widget
		 * @param attributes {keyValuePairList} The instruction about the label apperance
		 */
		_setupLabelAppearance: function(labelWidget, attributes) {
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

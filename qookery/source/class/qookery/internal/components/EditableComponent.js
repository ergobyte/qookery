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
		value: { init: null, inheritable: true, nullable: true, apply: "_applyValue", event: "changeValue" },
		label: { check: "String", inheritable: true, nullable: true, apply: "_applyLabel" },
	    toolTip: { check: "String", inheritable: true, nullable: true, apply: "_applyToolTip" },
		required: { check: "Boolean", inheritable: true, nullable: false, init: false, apply: "_applyRequired" },
		readOnly: { check: "Boolean", inheritable: true, nullable: false, init: false, apply: "_applyReadOnly" },
		format: { check: "qx.util.format.IFormat", inheritable: true, nullable: true, apply: "_applyFormat" },
		valid: { check: "Boolean", nullable: false, apply: "_applyValid" }
	},

	members: {

		_disableValueEvents: false,

		create: function(attributes) {
			this._widgets[0] = this._createMainWidget(attributes);
			if(attributes['required']) this.setRequired(true);
			if(attributes['label'] != '%none') {
				this._widgets[1] = new qx.ui.basic.Label();
				this._setupLabelAppearance(this._widgets[1], attributes);
				this.setLabel(attributes['label'] || "");
			}
			if(attributes['read-only']) this.setReadOnly(true);
			if(attributes['format']) this.setFormat(this._parseFormatSpecification(attributes['format']));
			this.base(arguments, attributes);
		},

		setup: function(attributes) {
			if(attributes['connect']) {
				var connectionQName = attributes['connect'];
				var modelProvider = qookery.Qookery.getModelProvider();
				if(modelProvider == null)
					throw new Error("Install a model provider to handle connections in XML forms");
				modelProvider.handleConnection(this, connectionQName[0], connectionQName[1]);
			}
		},

		/**
		 * Create a two way binding between controller and component's value
		 *
		 * @param controller {qx.data.controller.Object} The form controller that the bindings
		 * @param path {String} The protocol path
		 */
		connect: function(controller, propertyPath) {
			controller.addTarget(this, "value", propertyPath, true);
		},

		addValidation: function(validatorType, invalidMessage, options) {
			var validator = qookery.Qookery.getRegistry().getValidator(validatorType);
			if(!validator) throw new Error(qx.lang.String.format("Validator %1 not found", [ validatorType ]));
			if(!options) options = { };
			var validatorFunction = validator.createValidatorFunction(this, invalidMessage, options);
			this.getForm().addValidation(this, validatorFunction);
		},

		setInvalidMessage: function(message) {
			this.getMainWidget().setInvalidMessage(message);
		},

		clearValidations: function() {
			this.getForm().removeValidations(this);
		},

		_createMainWidget: function(attributes) {
			throw new Error("Override _createMainWidget() to provide implementation specific code");
		},

		getLabelWidget: function() {
			return this._widgets[1];
		},

		listWidgets: function(filterName) {
			var mainWidget = this._widgets[0];
			if(filterName == "main") return [ mainWidget ];
			var labelWidget = this._widgets[1];
			if(!labelWidget) return [ mainWidget ];
			// Reverse order of main and label widget since
			// we want to present the label in front of the editor
			return [ labelWidget, mainWidget ];
		},

		_updateUI: function(value) {
			// Override to update UI according to new value
		},

		// Apply methods

		_applyValid: function(value) {
			this.getMainWidget().setValid(value);
		},

		_applyFormat: function(format) {
			// Override to handle formats
		},

		_applyValue: function(value) {
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
			if(this.getRequired()) label += " (*)";
			labelWidget.setValue(label);
		},

		_applyToolTip: function(toolTip) {
			var mainWidget = this.getMainWidget();
			if(mainWidget) mainWidget.setToolTip(toolTip);
		},

		_applyRequired: function(required) {
			var mainWidget = this.getMainWidget();
			if(!mainWidget || !required) return;
			this.addValidation("notNull");
		},

		_applyReadOnly: function(readOnly) {
			// Subclasses should override to implement the read only property
		},

		// Utility methods for subclasses

		/**
		 * Parse a format specification
		 *
		 * <p>Format specification syntax is:</p>
		 *
		 * <pre>{formatName} [ ':' {option1} '=' {value1} [ ',' {option2} '=' {value2} ]* ]?</pre>
		 */
		_parseFormatSpecification: function(formatSpecification) {
			var formatName = formatSpecification;
			var options = {};
			var colonCharacterPos = formatSpecification.indexOf(":");
			if(colonCharacterPos != -1) {
				formatName = formatSpecification.slice(0, colonCharacterPos);
				var optionsStr = formatSpecification.slice(colonCharacterPos + 1);
				if(optionsStr) optionsStr.replace(/([^=,]+)=([^,]*)/g, function(m, key, value) {
					key = qx.lang.String.clean(key);
					value = qx.lang.String.clean(value);
					options[key] = value;
				});
			}
			return qookery.Qookery.getRegistry().createFormat(formatName, options);
		},

		_getIdentityOf: function(value) {
			if(value == null) return null;
			var modelProvider = qookery.Qookery.getModelProvider();
			if(!modelProvider) return value;
			return modelProvider.getIdentity(value);
		},

		_getLabelOf: function(value) {
			if(!value) return "";
			var format = this.getFormat();
			if(format) return format.format(value);
			var modelProvider = qookery.Qookery.getModelProvider();
			if(modelProvider) return modelProvider.getLabel(value);
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
		}
	}
});

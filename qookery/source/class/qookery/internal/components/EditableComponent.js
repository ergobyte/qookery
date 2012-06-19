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

	type : "abstract",
	extend: qookery.internal.components.ConnectableComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},
	
	members: {
		_editableWidget: null,
		_labelWidget: null,

		getMainWidget: function() {
			return this._editableWidget;
		},

		getLabel: function() {
			return this._labelWidget.getValue();
		},

		getValue: function() {
			return this._editableWidget.getValue();
		},

		setValue: function(value) {
			this._editableWidget.setValue(value);
		},

		setLabel: function(value) {
			this._labelWidget.setValue(value);
		},

		setToolTip: function(value) {
			if(value == null || value == '') return null;
			this._editableWidget.setToolTip(value);
		},

		setEnabled: function(enabled) {
			this._editableWidget.setEnabled(enabled);
		},

		setVisible: function(visibility) {
			if(visibility == true)
				this._editableWidget.show();
			else if(visibility == false)
				this._editableWidget.hide();
			else
				qx.log.Logger.error(this, "setVisible takes only boolean.");
		},

		setRequired: function(isRequired) {
			if(isRequired === true) {
				this._labelWidget.setRich(true);
				this._labelWidget.setValue(this._labelWidget.getValue()+" <b style='color:red'>*</b>");
				this._editableWidget.setRequired(true);
				this.getForm().getValidationManager().add(this._editableWidget);
			}
			else if(isRequired === false) {
				this.getForm().getValdationManager().remove(this._editableWidget);
				this._editableWidget.setRequired(false);
			}
			else {
				qx.log.Logger.error(this, "setRequired takes only boolean.");
			}
		},

		clearValue:function() {
			this._editableWidget.resetValue();
		},

		listWidgets: function(filterName) {
			if(filterName == "user") return [ this._editableWidget ];
			return this.base(arguments, filterName);
		}
	},

	destruct: function() {
		this._editableWidget.destroy();
		this._editableWidget = null;
		
		this._labelWidget.destroy();
		this._labelWidget = null;
		
	}
});

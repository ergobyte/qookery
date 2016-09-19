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
qx.Class.define("qookery.mobile.components.EditableComponent", {

	type: "abstract",
	implement: [ qookery.IEditableComponent ],
	extend: qookery.internal.components.EditableComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {

		// Initialization

		_createWidgets: function(attributes) {
			var mainWidget = this._createMainWidget(attributes);
			if(attributes["label"] !== "%none") {
				var label = new qx.ui.mobile.basic.Label();
				this._setupLabelAppearance(label, attributes);
				return [ mainWidget, label ];
			}
			return [ mainWidget ];
		},

		// Component overrides

		_applyEnabled: function(enabled) {
			var widgets = this.listWidgets();
			for(var i = 0; i < widgets.length; i++) {
				var widget = widgets[i];
				if(!(widget instanceof qx.ui.mobile.basic.Label)) widget.setEnabled(enabled);
			}
		},

		_applyToolTipText: function(toolTipText) {
			// Mobile does not support tooltips
		},

		_setupLabelAppearance: function(labelWidget, attributes) {
			// Mobile does not support align and stretch
		}
	}
});

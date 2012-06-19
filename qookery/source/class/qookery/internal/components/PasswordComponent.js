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

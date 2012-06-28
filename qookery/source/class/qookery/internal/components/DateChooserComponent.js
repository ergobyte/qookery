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
 * A date chooser component that understand ISO 8601.
 * In the near feauture will be implemented more types of date.
 */
qx.Class.define("qookery.internal.components.DateChooserComponent", {

	extend: qookery.internal.components.EditableComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},
	
	members: {

		_createMainWidget: function(createOptions) {
			var widget = new qx.ui.form.DateField();
			this._applyLayoutProperties(widget, createOptions);
			return widget;
		},

		connect: function(controller, propertyPath) {
			controller.addTarget(this.getMainWidget(), "value", propertyPath, true);
		}
	}
});

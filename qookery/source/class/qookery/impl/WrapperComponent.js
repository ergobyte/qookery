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
 * Class wrapping Qooxdoo widgets as Qookery components
 */
qx.Class.define("qookery.impl.WrapperComponent", {

	extend: qookery.internal.components.BaseComponent,

	construct: function(widgetClass, parentComponent) {
		this.base(arguments, parentComponent);
		this.__widgetClass = widgetClass;
	},

	members: {

		__widgetClass: null,

		create: function(attributes) {
			this._widgets[0] = new this.__widgetClass(attributes);
			this._applyLayoutAttributes(this._widgets[0], attributes);
			this.base(arguments, attributes);
		}
	}
});

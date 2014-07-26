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

qx.Class.define("qookery.internal.components.SplitPaneComponent", {

	extend: qookery.internal.components.ContainerComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {

		create: function(attributes) {
			attributes['column-count'] = 'none';
			this.base(arguments, attributes);
		},

		_createContainerWidget: function(attributes) {
			var orientation = attributes['orientation'] ? attributes['orientation'] : "horizontal";
			var pane = new qx.ui.splitpane.Pane(orientation);
			this._applyLayoutAttributes(pane, attributes);
			return pane;
		}
	}
});

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

qx.Class.define("qookery.internal.components.TabViewPageComponent", {

	extend: qookery.internal.components.ContainerComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {

		// Metadata

		getAttributeType: function(attributeName) {
			switch(attributeName) {
			case "show-close-button": return "Boolean";
			}
			return this.base(arguments, attributeName);
		},

		// Construction

		_createContainerWidget: function() {
			var page = new qx.ui.tabview.Page(this.getAttribute("label", null), this.getAttribute("icon", null));
			this._applyAttribute("show-close-button", page, "showCloseButton");
			this._applyWidgetAttributes(page);
			return page;
		}
	}
});

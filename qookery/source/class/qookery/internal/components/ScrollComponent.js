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
 * Component wrapping a Qooxdoo qx.ui.container.Scroll
 */
qx.Class.define("qookery.internal.components.ScrollComponent", {

	extend: qookery.internal.components.ContainerComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {
		
		__scroll: null,
		__composite: null,

		_createContainerWidget: function(attributes) {
			this.__scroll = new qx.ui.container.Scroll();
			this.__composite = new qx.ui.container.Composite();
			this.__scroll.add(this.__composite, { flex: 1, width: "100%", height: "100%" });
			this._applyLayoutAttributes(this.__scroll, attributes);
			return this.__scroll;
		},
		
		getMainWidget: function() {
			return this.__composite;
		}
	}
});

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

qx.Class.define("qookery.internal.components.ImageComponent", {

	extend: qookery.internal.components.BaseComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {

		_createWidgets: function(attributes) {
			var image = new qx.ui.basic.Image(attributes['source']);
			if(attributes['scale'] !== undefined) image.setScale(attributes['scale']);
			this._applyLayoutAttributes(image, attributes);
			return [ image ];
		},

		getSource: function() {
			return this._widgets[0].getSource();
		},

		setSource: function(source) {
			this._widgets[0].setSource(source);
		},

		getScale: function() {
			return this.getMainWidget().getScale();
		},

		setScale: function(scale) {
			this.getMainWidget().setScale(scale);
		}
	}
});

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

qx.Class.define("qookery.internal.components.CanvasComponent", {

	extend: qookery.internal.components.Component,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {

		// Metadata

		getAttributeType: function(attributeName) {
			switch(attributeName) {
			case "canvas-height": return "Size";
			case "canvas-width": return "Size";
			case "sync-dimension": return "Boolean";
			default: return this.base(arguments, attributeName);
			}
		},

		// Lifecycle

		_createWidgets: function() {
			var canvas = new qx.ui.embed.Canvas(this.getAttribute("canvas-width", 300), this.getAttribute("canvas-height", 150));
			this._applyAttribute("sync-dimension", canvas, "syncDimension");
			this._applyWidgetAttributes(canvas);
			return [ canvas ];
		},

		// Methods

		getContext2d: function() {
			return this.getMainWidget().getContext2d();
		},

		update: function() {
			this.getMainWidget().update();
		}
	}
});

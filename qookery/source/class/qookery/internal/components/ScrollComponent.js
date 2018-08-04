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

		__composite: null,

		// Metadata

		getAttributeType: function(attributeName) {
			switch(attributeName) {
			case "content-padding": return "IntegerList";
			case "content-padding-bottom": return "Integer";
			case "content-padding-left": return "Integer";
			case "content-padding-right": return "Integer";
			case "content-padding-top": return "Integer";
			case "scrollbar-x": return "String";
			case "scrollbar-y": return "String";
			}
			return this.base(arguments, attributeName);
		},

		// Construction

		_createContainerWidget: function(attributes) {
			var scroll = new qx.ui.container.Scroll();
			this.__composite = new qx.ui.container.Composite();
			scroll.add(this.__composite);
			if(attributes["content-padding"] !== undefined)
				scroll.setContentPadding(attributes["content-padding"]);
			if(attributes["content-padding-top"] !== undefined)
				scroll.setContentPaddingTop(attributes["content-padding-top"]);
			if(attributes["content-padding-right"] !== undefined)
				scroll.setContentPaddingRight(attributes["content-padding-right"]);
			if(attributes["content-padding-bottom"] !== undefined)
				scroll.setContentPaddingBottom(attributes["content-padding-bottom"]);
			if(attributes["content-padding-left"] !== undefined)
				scroll.setContentPaddingLeft(attributes["content-padding-left"]);
			scroll.setScrollbarX(this.getAttribute("scrollbar-x", "auto"));
			scroll.setScrollbarY(this.getAttribute("scrollbar-y", "auto"));
			this._applyLayoutAttributes(scroll, attributes);
			return scroll;
		},

		getAttribute: function(attributeName, defaultValue) {
			if(attributeName === "layout") return "none";
			return this.base(arguments, attributeName, defaultValue);
		},

		getMainWidget: function() {
			return this.__composite;
		}
	}
});

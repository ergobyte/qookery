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

qx.Class.define("qookery.internal.components.GroupBoxComponent", {

	extend: qookery.internal.components.ContainerComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {

		// Metadata

		getAttributeType: function(attributeName) {
			switch(attributeName) {
			case "content-padding": return "IntegerList";
			case "content-padding-bottom": return "Integer";
			case "content-padding-left": return "Integer";
			case "content-padding-right": return "Integer";
			case "content-padding-top": return "Integer";
			}
			return this.base(arguments, attributeName);
		},

		// Construction

		_createContainerWidget: function(attributes) {
			var groupBox = new qx.ui.groupbox.GroupBox(this.getAttribute("label"), this.getAttribute("icon"));
			groupBox.setLegendPosition(this.getAttribute("legend-position", "middle"));
			if(attributes["content-padding"] !== undefined) groupBox.setContentPadding(attributes["content-padding"]);
			if(attributes["content-padding-top"] !== undefined) groupBox.setContentPaddingTop(attributes["content-padding-top"]);
			if(attributes["content-padding-right"] !== undefined) groupBox.setContentPaddingRight(attributes["content-padding-right"]);
			if(attributes["content-padding-bottom"] !== undefined) groupBox.setContentPaddingBottom(attributes["content-padding-bottom"]);
			if(attributes["content-padding-left"] !== undefined) groupBox.setContentPaddingLeft(attributes["content-padding-left"]);
			var label = groupBox.getChildControl("legend").getChildControl("label");
			label.setAllowGrowX(true);
			label.setTextAlign(this.getAttribute("text-align", "left"));
			this._applyLayoutAttributes(groupBox, attributes);
			return groupBox;
		},

		getLegend: function() {
			return this.getMainWidget().getLegend();
		},

		setLegend: function(legend) {
			this.getMainWidget().setLegend(legend);
		}
	}
});

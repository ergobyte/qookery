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

qx.Class.define("qookery.internal.components.TabViewComponent", {

	extend: qookery.internal.components.ContainerComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {

		// Metadata

		getAttributeType: function(attributeName) {
			switch(attributeName) {
			case "bar-position": return "String";
			case "content-padding": return "IntegerList";
			case "content-padding-bottom": return "Integer";
			case "content-padding-left": return "Integer";
			case "content-padding-right": return "Integer";
			case "content-padding-top": return "Integer";
			default: return this.base(arguments, attributeName);
			}
		},

		// Construction

		create: function(attributes) {
			attributes["layout"] = "none";
			this.base(arguments, attributes);
		},

		_createContainerWidget: function(attributes) {
			var tabView = new qx.ui.tabview.TabView();
			tabView.setBarPosition(this.getAttribute("bar-position", "top"));
			if(attributes["content-padding"] !== undefined) tabView.setContentPadding(attributes["content-padding"]);
			if(attributes["content-padding-top"] !== undefined) tabView.setContentPaddingTop(attributes["content-padding-top"]);
			if(attributes["content-padding-right"] !== undefined) tabView.setContentPaddingRight(attributes["content-padding-right"]);
			if(attributes["content-padding-bottom"] !== undefined) tabView.setContentPaddingBottom(attributes["content-padding-bottom"]);
			if(attributes["content-padding-left"] !== undefined) tabView.setContentPaddingLeft(attributes["content-padding-left"]);
			this._applyLayoutAttributes(tabView, attributes);
			return tabView;
		},

		getSelection: function() {
			var selection = this.getMainWidget().getSelection();
			if(!selection || selection.length !== 1) return null;
			return selection[0].getUserData("qookeryComponent");
		},

		setSelection: function(page) {
			this.getMainWidget().setSelection(page ? [ page.getMainWidget() ] : [ ]);
		}
	}
});

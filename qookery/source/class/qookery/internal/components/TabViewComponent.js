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

		_createContainerWidget: function() {
			var tabView = new qx.ui.tabview.TabView();
			this._applyAttribute("bar-position", tabView, "barPosition");
			this._applyAttribute("content-padding", tabView, "contentPadding");
			this._applyAttribute("content-padding-top", tabView, "contentPaddingTop");
			this._applyAttribute("content-padding-right", tabView, "contentPaddingRight");
			this._applyAttribute("content-padding-bottom", tabView, "contentPaddingBottom");
			this._applyAttribute("content-padding-left", tabView, "contentPaddingLeft");
			this._applyWidgetAttributes(tabView);
			return tabView;
		},

		getAttribute: function(attributeName, defaultValue) {
			if(attributeName === "layout") return "none";
			return this.base(arguments, attributeName, defaultValue);
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

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

qx.Class.define("qookery.internal.components.AtomComponent", {

	type : "abstract",
	extend: qookery.internal.components.Component,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {

		// Metadata

		getAttributeType: function(attributeName) {
			switch(attributeName) {
			case "center": return "Boolean";
			case "gap": return "Number";
			case "rich": return "Boolean";
			case "show": return "String";
			}
			return this.base(arguments, attributeName);
		},

		// Construction

		_createWidgets: function() {
			var atom = this._createAtomWidget();
			return [ atom ];
		},

		_createAtomWidget: function() {
			throw new Error("Override _createAtomWidget() to provide implementation specific code");
		},

		_applyAtomAttributes: function(atom) {
			this._applyAttribute("center", atom, "center");
			this._applyAttribute("gap", atom, "gap");
			this._applyAttribute("icon", atom, "icon");
			this._applyAttribute("icon-position", atom, "iconPosition");
			this._applyAttribute("label", atom, "label");
			this._applyAttribute("rich", atom, "rich");
			this._applyAttribute("show", atom, "show");
			this._applyAttribute("text-align", this, function(textAlign) {
				atom.getChildControl("label").setAllowGrowX(true);
				atom.getChildControl("label").setTextAlign(textAlign);
			});
			this._applyWidgetAttributes(atom);
		},

		getLabel: function() {
			return this.getMainWidget().getLabel();
		},

		setLabel: function(label) {
			this.getMainWidget().setLabel(label);
		},

		getIcon: function() {
			return this.getMainWidget().getIcon();
		},

		setIcon: function(icon) {
			this.getMainWidget().setIcon(icon);
		}
	}
});

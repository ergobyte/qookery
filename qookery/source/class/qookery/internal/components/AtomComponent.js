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
	extend: qookery.internal.components.BaseComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {

		// Metadata

		getAttributeType: function(attributeName) {
			switch(attributeName) {
			case "rich": return "Boolean";
			}
			return this.base(arguments, attributeName);
		},

		// Construction

		_createWidgets: function(attributes) {
			var atom = this._createAtomWidget(attributes);
			return [ atom ];
		},

		_createAtomWidget: function(attributes) {
			throw new Error("Override _createAtomWidget() to provide implementation specific code");
		},

		_applyAtomAttributes: function(atom, attributes) {
			if(attributes["center"] !== undefined) atom.setCenter(attributes["center"]);
			if(attributes["icon"] !== undefined) atom.setIcon(attributes["icon"]);
			if(attributes["icon-position"] !== undefined) atom.setIconPosition(attributes["icon-position"]);
			if(attributes["rich"] !== undefined) atom.setRich(attributes["rich"]);
			this._applyLayoutAttributes(atom, attributes);
		},

		setLabel: function(label) {
			this.getMainWidget().setLabel(label);
		}
	}
});

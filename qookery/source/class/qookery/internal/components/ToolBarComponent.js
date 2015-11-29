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

qx.Class.define("qookery.internal.components.ToolBarComponent", {

	extend: qookery.internal.components.BaseComponent,
	implement: [ qookery.IContainerComponent ],

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
		this.__children = [ ];
		this.__flexes = [ ];
	},

	members: {

		__children: null,
		__toolbar: null,
		__flexes: null,

		create: function(attributes) {
			this.base(arguments, attributes);
			this.__toolbar = this.getMainWidget();
			if(attributes["column-flexes"] === undefined) return;
			qx.util.StringSplit.split(attributes["column-flexes"], /\s+/).forEach(function(columnFlex) {
				this.__flexes.push(parseInt(columnFlex, 10));
			}, this);
		},

		_createWidgets: function(attributes) {
			var toolbar = new qx.ui.toolbar.ToolBar();
			if(undefined !== attributes["spacing"]) toolbar.setSpacing(attributes["spacing"]);
			this._applyLayoutAttributes(toolbar, attributes);
			return [ toolbar ];
		},

		listChildren: function() {
			return this.__children;
		},

		add: function(childComponent, display) {
			var index = this.__children.length;
			this.__children.push(childComponent);
			var part = childComponent.getMainWidget();
			var flex = this.__flexes[index];
			this.__toolbar.add(part, flex !== undefined ? { flex: flex } : null);
		},

		remove: function(component) {
			// TODO ToolBar: Implement removal of children
		},

		contains: function(component) {
			// TODO ToolBar: Implement contains()
		}
	}
});

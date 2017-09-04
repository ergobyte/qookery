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

qx.Class.define("qookery.internal.components.StackComponent", {

	extend: qookery.internal.components.ContainerComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	properties: {
		dynamic: { check: "Boolean", nullable: false, apply: "_applyDynamic" }
	},

	members: {

		getAttributeType: function(attributeName) {
			switch(attributeName) {
			case "dynamic": return "Boolean";
			default: return this.base(arguments, attributeName);
			}
		},

		create: function(attributes) {
			this.base(arguments, attributes);
			if(attributes["dynamic"] !== undefined) this.setDynamic(attributes["dynamic"]);
		},

		_createContainerWidget: function(attributes) {
			var stack = new qx.ui.container.Stack();
			this._applyLayoutAttributes(stack, attributes);
			return stack;
		},

		getAttribute: function(attributeName, defaultValue) {
			if(attributeName === "layout") return "none";
			return this.base(arguments, attributeName, defaultValue);
		},

		setSelection: function(component) {
			var container = this.getMainWidget();
			var widget = component.getMainWidget();
			if(!container || !widget) return;
			container.setSelection([ widget ]);
		},

		getSelection: function() {
			var container = this.getMainWidget();
			if(!container) return null;
			var selection = container.getSelection();
			if(!selection || selection.length === 0) return null;
			return (selection[0]).getUserData("qookeryComponent");
		},

		selectNext: function() {
			var container = this.getMainWidget();
			var index = 0;
			var children = container.getChildren();
			var selection = container.getSelection();
			if(selection && selection.length === 1) {
				index = children.indexOf(selection[0]) + 1;
				if(index >= children.length) index = 0;
			}
			container.setSelection([ children[index] ]);
		},

		_applyDynamic: function(dynamic) {
			var container = this.getMainWidget();
			if(!container) return null;
			container.setDynamic(dynamic);
		}
	}
});

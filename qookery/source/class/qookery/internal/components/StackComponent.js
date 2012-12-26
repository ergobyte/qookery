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

	$Id: GroupComponent.js 33 2012-12-18 14:44:08Z geonik@ergobyte.gr $
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

		create: function(attributes) {
			this.base(arguments, attributes);
			if(attributes['dynamic']) this.setDynamic(true);
		},

		_createContainerWidget: function(attributes) {
			var container = new qx.ui.container.Stack();
			this._applyLayoutAttributes(container, attributes);
			attributes['column-count'] = "none";
			return container;
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
			if(!selection || selection.lenght == 0) return null;
			return (selection[0]).getUserData("qookeryComponent");
		},

		_applyDynamic: function(dynamic) {
			var container = this.getMainWidget();
			if(!container) return null;
			container.setDynamic(dynamic);
		}
	}
});

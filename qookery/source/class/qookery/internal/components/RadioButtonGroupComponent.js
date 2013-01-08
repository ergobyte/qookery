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

	$Id$
*/

qx.Class.define("qookery.internal.components.RadioButtonGroupComponent", {

	extend: qookery.internal.components.EditableComponent,
	implement: [ qookery.IContainerComponent ],

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
		this.__children = [ ];
	},

	members: {

		__children: null,

		_createMainWidget: function(attributes) {
			var group = new qx.ui.form.RadioButtonGroup(new qx.ui.layout.HBox(10));
			this._applyLayoutAttributes(group, attributes);
			group.addListener("changeSelection", function(event) {
				var selection = event.getData();
				if(selection.length == 0)
					this.setValue(null);
				else
					this.setValue(selection[0].getModel());
			}, this);
			return group;
		},

		addChild: function(childComponent, display) {
			var radioButton = childComponent.getMainWidget();
			if(!qx.Class.hasInterface(radioButton.constructor, qx.ui.form.IRadioItem))
				throw new Error("<radio-button-group> supports only components with main widgets implementing IRadioItem");
			this.__children.push(childComponent);
			var radioButtonGroup = this.getMainWidget();
			radioButtonGroup.add(radioButton);
		},

		listChildren: function() {
			return this.__children;
		},

		initialize: function(initOptions) {
			var radioButtonGroup = this.getMainWidget();
			radioButtonGroup.removeAll();
			if(!initOptions || !initOptions["items"]) return;
			for(var itemValue in initOptions["items"]) {
				var itemLabel = initOptions["items"][itemValue];
				var radioButton = new qx.ui.form.RadioButton(itemLabel);
				radioButton.setModel(itemValue);
				radioButtonGroup.add(radioButton);
			}
		},

		_updateUI: function(value) {
			var radioButtonGroup = this.getMainWidget();
			var valueIdentity = this._getIdentityOf(value);
			var isArray = qx.lang.Type.isArray(valueIdentity);
			var buttons = radioButtonGroup.getChildren();
			for(var i = 0; i < buttons.length; i++) {
				var button = buttons[i];
				var buttonValue = button.getModel();
				var buttonIdentity = this._getIdentityOf(buttonValue);
				if(isArray) {
					if(!qx.lang.Array.equals(valueIdentity, buttonIdentity)) continue;
				}
				else {
					if(valueIdentity != buttonIdentity) continue;
				}
				radioButtonGroup.setSelection([ button ]);
				return;
			}
		}
	},

	destruct: function() {
		this._disposeArray("__children");
	}
});

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

qx.Class.define("qookery.internal.components.RadioButtonGroupComponent", {

	extend: qookery.internal.components.EditableComponent,
	implement: [ qookery.IContainerComponent ],

	properties: {
		orientation: { check: [ "horizontal", "vertical" ], inheritable: true, nullable: false, init: "horizontal", apply: "_applyOrientation" }
	},

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
		this.__children = [ ];
	},

	members: {

		__children: null,

		create: function(attributes) {
			this.base(arguments, attributes);
			if(attributes['layout']) this.setLayout(attributes['layout']);
			if(attributes['allow-empty-selection'] == "true") this.getMainWidget().getRadioGroup().set({ allowEmptySelection: true });
		},

		_createMainWidget: function(attributes) {
			var spacing = (attributes['spacing'] != null) ? attributes['spacing'] : 10;
			var group = new qx.ui.form.RadioButtonGroup(new qx.ui.layout.HBox(spacing));
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

		add: function(childComponent, display) {
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

		setItems: function(items) {
			var radioButtonGroup = this.getMainWidget();
			radioButtonGroup.removeAll();
			
			if(items instanceof qx.data.Array)
				items = items.toArray();
			
			if(qx.lang.Type.isArray(items)) {
				for( var i=0; i< items.length; i++) {
					var model = items[i];
					var label = this._getLabelOf(model);
					var groupItem = new qx.ui.form.RadioButton(label);
					groupItem.setModel(model);
					radioButtonGroup.add(groupItem);
				}
				return;
			}
			
			if(qx.lang.Type.isObject(items)) {
				for(var model in items) {
					var label = items[model];
					var groupItem = new qx.ui.form.RadioButton(label);
					groupItem.setModel(model);
					radioButtonGroup.add(groupItem);
				}
			}
		},

		_updateUI: function(value) {
			var radioButtonGroup = this.getMainWidget();
			var buttons = radioButtonGroup.getChildren();
			for(var i = 0; i < buttons.length; i++) {
				var button = buttons[i];
				var buttonValue = button.getModel();
				if(!qookery.contexts.Model.areEqual(buttonValue, value)) continue;
				radioButtonGroup.setSelection([ button ]);
				return;
			}
		},

		remove: function(component) {
			//TODO
		},

		contains: function(component) {
			//TODO
		},

		_applyOrientation: function(orientation) {
			var map = { "horizontal": qx.ui.layout.HBox, "vertical": qx.ui.layout.VBox };
			if(!map[orientation]) return;
			var layout = new map[orientation](10);
			this.getMainWidget().setLayout(layout);
		}
	},

	destruct: function() {
		this._disposeArray("__children");
	}
});

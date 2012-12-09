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

/**
 * A form widget which allows a single selection
 */
qx.Class.define("qookery.internal.components.SelectBoxComponent", {

	extend: qookery.internal.components.EditableComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},
	
	statics: {
		nullLabelModel: "emptySelection"
	},

	members: {
		
		__hasNullValue: false,
		__nullLabel: "",
		
		_createMainWidget: function(createOptions) {
			var selectBox = new qx.ui.form.SelectBox();
			this._applyLayoutProperties(selectBox, createOptions);
			selectBox.addListener("changeSelection", function(event) {
				if(this._disableValueEvents) return;
				var newSelection = event.getData()[0];
				var model = newSelection ? newSelection.getModel() : null;
				if(model == qookery.internal.components.SelectBoxComponent.nullLabelModel) model = null;
				this.setValue(model);
			}, this);
			return selectBox;
		},
		
		_updateUI: function(value) {
			var selectBox = this.getMainWidget();
			var valueIdentity = this._getIdentityOf(value);
			var listItems = selectBox.getChildren();
			for(var i = 0; i < listItems.length; i++) {
				var listItem = listItems[i];
				var item = listItem.getModel();
				var itemIdentity = this._getIdentityOf(item);
				if(valueIdentity != itemIdentity) continue;
				selectBox.setSelection([ listItem ]);
				return;
			}
		},
		
		addItem: function(model, label, icon) {
			qx.core.Assert.assertNotNull(model);
			if(!label) label = this._getLabelOf(model);
			var item = new qx.ui.form.ListItem(label, icon, model);
			this.getMainWidget().add(item);
		},

		setItems: function(items) {
			var selectBox = this.getMainWidget();
			selectBox.removeAll();
			if(this.__hasNullValue) {
				var listItem = new qx.ui.form.ListItem(this.__nullLabel, null, qookery.internal.components.SelectBoxComponent.nullLabelModel);
				selectBox.add(listItem);
			}
			if(qx.lang.Type.isArray(items)) {
				for(var i = 0; i < items.length; i++) {
					var model = items.getItem(i);
					var label = this._getLabelOf(model);
					var listItem = new qx.ui.form.ListItem(label, null, model);
					selectBox.add(listItem);
				}
				return;
			}
			if(qx.lang.Type.isObject(items)) {
				for(var model in items) {
					var label = items[model];
					var listItem = new qx.ui.form.ListItem(label, null, model);
					selectBox.add(listItem);
				}
			}
		},
		
		initialize: function(initOptions) {
			if(!initOptions) return;
			if(initOptions["format"]) {
				this.getMainWidget().setFormat(function (item) {
					if(!item) return "";
					if (item.getModel() == qookery.internal.components.SelectBoxComponent.nullLabelModel) return item.getLabel();
					if (item.getModel())
						return initOptions["format"](item.getModel());
					return initOptions["format"](item);
				});
			}
			if(initOptions["itemsMap"])
				this.setItems(initOptions["itemsMap"]);
			if(initOptions["nullLabel"]) {
				this.__hasNullValue = true;
				this.__nullLabel = initOptions["nullLabel"];
			}
		}
	}
});

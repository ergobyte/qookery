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

	members: {
		
		_createMainWidget: function(createOptions) {
			var selectBox = new qx.ui.form.SelectBox();
			this._applyLayoutProperties(selectBox, createOptions);
			selectBox.addListener("changeSelection", function(event) {
				var newSelection = event.getData()[0];
				var model = newSelection ? newSelection.getModel() : null;
				this.setValue(model);
			}, this);
			return selectBox;
		},
		
		_applyValue: function(value) {
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
			if(!initOptions || !initOptions["itemsMap"]) return;
			this.setItems(initOptions["itemsMap"]);
		}
	}
});

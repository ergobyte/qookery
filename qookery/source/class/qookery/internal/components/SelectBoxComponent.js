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
		nullItemModel: new String("null")
	},

	members: {

		__nullItemLabel: "",

		create: function(attributes) {
			this.base(arguments, attributes);
			if(attributes['null-item-label']) this.__nullItemLabel = attributes['null-item-label'];
		},

		_createMainWidget: function(attributes) {
			var selectBox = new qx.ui.form.SelectBox();
			this._applyLayoutAttributes(selectBox, attributes);
			selectBox.addListener("changeSelection", function(event) {
				if(this._disableValueEvents) return;
				var newSelection = event.getData()[0];
				var model = newSelection ? newSelection.getModel() : null;
				if(model === this.constructor.nullItemModel) model = null;
				this.setValue(model);
			}, this);
			selectBox.setFormat(function(item) {
				if(!item) return "";
				var model = item.getModel();
				if(model === this.constructor.nullItemModel) return this.__nullItemLabel;
				return item.getLabel();
			}.bind(this));
			return selectBox;
		},

		initialize: function(initOptions) {
			if(initOptions["items"]) this.setItems(initOptions["items"]);
		},

		_updateUI: function(value) {
			var selectBox = this.getMainWidget();
			var valueIdentity = this._getIdentityOf(value);
			var isArray = qx.lang.Type.isArray(valueIdentity);
			var listItems = selectBox.getChildren();
			for(var i = 0; i < listItems.length; i++) {
				var listItem = listItems[i];
				var item = listItem.getModel();
				var itemIdentity = this._getIdentityOf(item);
				if(isArray) {
					if(!qx.lang.Array.equals(valueIdentity, itemIdentity)) continue;
				}
				else {
					if(valueIdentity != itemIdentity) continue;
				}
				selectBox.setSelection([ listItem ]);
				return;
			}
		},

		_getIdentityOf: function(value) {
			var result = this.base(arguments, value);
			if(this.__nullItemLabel && result == null)
				return this.constructor.nullItemModel;
			return result;
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
			if(this.__nullItemLabel) {
				var listItem = new qx.ui.form.ListItem(this.__nullItemLabel, null, this.constructor.nullItemModel);
				selectBox.add(listItem);
			}
			if(items instanceof qx.data.Array) {
				items = items.toArray();
			}
			if(qx.lang.Type.isArray(items)) {
				for(var i = 0; i < items.length; i++) {
					var model = items[i];
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
		}
	}
});

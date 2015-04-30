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

qx.Class.define("qookery.internal.components.ListComponent", {

	extend: qookery.internal.components.EditableComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
		this.__listItemsMap = { };
	},

	members: {

		__listItemsMap: null,

		_createMainWidget: function(attributes) {
			var list = new qx.ui.form.List();
			list.setScrollbarY(this.getAttribute("scrollbarY", "auto"));
			list.setSelectionMode(this.getAttribute("selectionMode", "single"));
			list.addListener("changeSelection", this.__onChangeSelection, this);
			this._applyLayoutAttributes(list, attributes);
			return list;
		},

		_updateUI: function(value) {
			var selectionMode = this.getMainWidget().getSelectionMode();
			if(!value) {
				this.getMainWidget().resetSelection();
				return;
			}
			var itemsToSelect = [ ];
			switch(selectionMode) {
			case "single":
				var selectedItem = this.__listItemsMap[value];
				itemsToSelect.push(selectedItem);
				break;
			case "additive":
			case "multi":
				if(value && value.length != 0) {
					for(var i = 0; i < value.length; i++) {
						itemsToSelect.push(this.__listItemsMap[value[i]]);
					}
				}
				break;
			default:
				throw new Error("Unimplemented selection mode " + selectionMode);
			}

			if(itemsToSelect.length != 0) {
				this.getMainWidget().setSelection(itemsToSelect);
			}
			else {
				this.getMainWidget().resetSelection();
			}
		},

		setItems: function(items) {
			if(!items) return;
			var list = this.getMainWidget();
			list.removeAll();
			this.__listItemsMap = { };
			for(var property in items) {
				var item = new qx.ui.form.ListItem(items[property]);
				this.__listItemsMap[property] = item;
				list.add(item);
			}
		},

		select: function(value) {
			this._updateUI(value);
		},

		__onChangeSelection:function(event) {
			if(this._disableValueEvents) return;
			if(event.getData() == null ||event.getData().length == 0) {
				this.setValue(null);
				return;
			}
			var selectionMode = this.getMainWidget().getSelectionMode();
			switch(selectionMode) {
			case "single":
				var selectedItem = event.getData()[0];
				this.setValue(qx.lang.Object.getKeyFromValue(this.__listItemsMap, selectedItem));
				return;
			case "additive":
			case "multi":
				var selectedItems = event.getData();
				var selectedItemsKeys = selectedItems.reduce(function(selectedKeys, currentItem) {
					selectedKeys.push(qx.lang.Object.getKeyFromValue(this.__listItemsMap, currentItem));
					return selectedKeys;
				}.bind(this), [ ]);
				this.setValue(selectedItemsKeys);
				return;
			default:
				throw new Error("Unimplemented selection mode " + selectionMode);
			}
		}
	}
});

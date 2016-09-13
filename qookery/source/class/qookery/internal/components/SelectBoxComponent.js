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

/**
 * Component for {@link qx.ui.form.SelectBox}
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
		__keepSorted: null,

		// Metadata

		getAttributeType: function(attributeName) {
			switch(attributeName) {
			case "keep-sorted": return "Boolean";
			case "map": return "String";
			case "null-item-label": return "ReplaceableString";
			}
			return this.base(arguments, attributeName);
		},

		// Construction

		create: function(attributes) {
			this.base(arguments, attributes);
			this.__nullItemLabel = this.getAttribute("null-item-label");
			this.__keepSorted = this.getAttribute("keep-sorted", true);
		},

		_createMainWidget: function(attributes) {
			var selectBox = new qx.ui.form.SelectBox();
			selectBox.setFormat(this.__getListItemLabel.bind(this));
			selectBox.addListener("changeSelection", function(event) {
				if(this._disableValueEvents) return;
				var newSelection = event.getData()[0];
				var model = newSelection ? newSelection.getModel() : null;
				if(model === this.constructor.nullItemModel) model = null;
				this.setValue(model);
			}, this);
			selectBox.addListener("keypress", function(event) {
				if(event.isShiftPressed() || event.isAltPressed() || event.isCtrlPressed()) return;
				switch(event.getKeyIdentifier()) {
				case "Delete":
				case "Backspace":
					this.setValue(null);
					event.preventDefault();
					return;
				}
			}, this);

			this._applyLayoutAttributes(selectBox, attributes);
			return selectBox;
		},

		_applyConnectionHandle: function(modelProvider, connectionHandle) {
			if(this.getAttribute("map") === undefined) {
				var mapName = modelProvider.getConnectionAttribute(connectionHandle, "map");
				if(mapName) this.setItems(qookery.Qookery.getRegistry().getMap(mapName));
			}
			this.base(arguments, modelProvider, connectionHandle);
		},

		setup: function(formParser, attributes) {
			var mapName = this.getAttribute("map");
			if(mapName !== undefined)
				this.setItems(qookery.Qookery.getRegistry().getMap(mapName));
			this.base(arguments, formParser, attributes);
		},

		__getListItemLabel: function(listItem) {
			if(!listItem) return "";
			var model = listItem.getModel();
			if(model === this.constructor.nullItemModel) return this.__nullItemLabel;
			return listItem.getLabel();
		},

		_updateUI: function(value) {
			if(value == null && this.__nullItemLabel !== undefined)
				value = this.constructor.nullItemModel;
			var selectBox = this.getMainWidget();
			var listItems = selectBox.getChildren();
			var modelProvider = this.getForm().getModelProvider();
			for(var i = 0; i < listItems.length; i++) {
				var listItem = listItems[i];
				var item = listItem.getModel();
				if(!modelProvider.areEqual(item, value)) continue;
				selectBox.setSelection([ listItem ]);
				return;
			}
		},

		_applyReadOnly: function(readOnly) {
			this.base(arguments, readOnly);
			this.getMainWidget().setEnabled(!readOnly);
		},

		addItem: function(model, label, icon) {
			if(!label) label = this._getLabelOf(model);
			var item = new qx.ui.form.ListItem(label, icon, model);
			var selectBox = this.getMainWidget();
			if(this.__keepSorted) {
				var insertionIndex = 0, existingItems = selectBox.getChildren(), lastIndex = existingItems.length;
				while(insertionIndex < lastIndex) {
					var existingItem = existingItems[insertionIndex];
					if(existingItem.getLabel() > label) break;
					insertionIndex++;
				}
				selectBox.addAt(item, insertionIndex);
			}
			else selectBox.add(item);
		},

		addNullItem: function() {
			var listItem = new qx.ui.form.ListItem(this.__nullItemLabel, null, this.constructor.nullItemModel);
			this.getMainWidget().add(listItem);
		},

		removeAllItems: function() {
			this.getMainWidget().removeAll();
		},

		setItems: function(items) {
			var selectBox = this.getMainWidget();
			selectBox.removeAll();
			if(this.__nullItemLabel !== undefined) {
				this.addNullItem();
			}
			if(items instanceof qx.data.Array) {
				items = items.toArray();
			}
			if(qx.lang.Type.isArray(items)) {
				for(var i = 0; i < items.length; i++) {
					var model = items[i];
					this.addItem(model);
				}
				return;
			}
			if(qx.lang.Type.isObject(items)) {
				for(var model in items) {
					var label = items[model];
					this.addItem(model, qx.data.Conversion.toString(label));
				}
			}
		},

		setSelection: function(itemNumber) {
			var selectablesItems = this.getMainWidget().getSelectables(true);
			if(!selectablesItems || selectablesItems[itemNumber] === undefined) return;
			this.getMainWidget().setSelection([ selectablesItems[itemNumber] ]);
		}
	}
});

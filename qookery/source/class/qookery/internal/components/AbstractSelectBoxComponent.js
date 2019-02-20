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

qx.Class.define("qookery.internal.components.AbstractSelectBoxComponent", {

	type : "abstract",
	extend: qookery.internal.components.EditableComponent,

	statics: {
		_NULL_ITEM_MODEL: ""
	},

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {

		// Metadata

		getAttributeType: function(attributeName) {
			switch(attributeName) {
			case "keep-sorted": return "Boolean";
			case "map": return "String";
			case "max-list-height": return "Number";
			case "null-item-label": return "ReplaceableString";
			}
			return this.base(arguments, attributeName);
		},

		// Construction

		_applySelectBoxAttributes: function(selectBox) {
			this._applyAttribute("max-list-height", selectBox, "maxListHeight");
			this._applyWidgetAttributes(selectBox);
		},

		_applyConnection: function(modelProvider, connection) {
			if(this.getAttribute("map") === undefined) {
				var mapName = connection.getAttribute("map");
				if(mapName != null)
					this.setItems(qookery.Qookery.getRegistry().getMap(mapName));
			}
			this.base(arguments, modelProvider, connection);
		},

		setup: function() {
			var mapName = this.getAttribute("map");
			if(mapName !== undefined)
				this.setItems(qookery.Qookery.getRegistry().getMap(mapName));
			this.base(arguments);
		},

		// Public methods

		addItem: function(model, label, icon) {
			if(label == null)
				label = this._getLabelOf(model);
			var item = new qx.ui.form.ListItem(label, icon, model);
			var selectBox = this.getMainWidget();
			if(this.getAttribute("keep-sorted", true)) {
				var existingItems = selectBox.getChildren();
				for(var index = 0; index < existingItems.length; index++) {
					var existingItem = existingItems[index];
					if(existingItem.getModel() === qookery.internal.components.AbstractSelectBoxComponent._NULL_ITEM_MODEL)
						continue;
					if(existingItem.getLabel() > label)
						break;
				}
				selectBox.addAt(item, index);
			}
			else selectBox.add(item);
		},

		addNullItem: function(label, icon) {
			if(label === undefined)
				label = this.getAttribute("null-item-label", "");
			if(icon === undefined)
				icon = null;
			var item = new qx.ui.form.ListItem(label, icon, qookery.internal.components.AbstractSelectBoxComponent._NULL_ITEM_MODEL);
			this.getMainWidget().add(item);
		},

		removeAllItems: function() {
			this.getMainWidget().removeAll().forEach(function(item) { item.destroy(); });
		},

		getItems: function() {
			return this.getMainWidget().getChildren();
		},

		setItems: function(items) {
			this._disableValueEvents = true;
			try {
				this.removeAllItems();
				if(this.getAttribute("null-item-label") !== undefined) {
					this.addNullItem();
				}
				if(items instanceof qx.data.Array) {
					items = items.toArray();
				}
				if(qx.lang.Type.isArray(items)) {
					for(var i = 0; i < items.length; i++) {
						var item = items[i];
						if(item instanceof qx.ui.form.ListItem)
							this.getMainWidget().add(item);
						else
							this.addItem(item);
					}
				}
				else if(qx.lang.Type.isObject(items)) {
					for(var model in items) {
						var label = items[model];
						this.addItem(model, qx.data.Conversion.toString(label));
					}
				}
			}
			finally {
				this._disableValueEvents = false;
			}
			this._updateUI(this.getValue());
		},

		// Internals

		_applyEnabled: function(enabled) {
			var labelWidget = this.getLabelWidget();
			if(labelWidget != null)
				labelWidget.setEnabled(enabled);
			this.__updateEnabled();
		},

		_applyReadOnly: function(readOnly) {
			this.base(arguments, readOnly);
			this.__updateEnabled();
		},

		__updateEnabled: function() {
			var isEnabled = this.getEnabled();
			var isReadOnly = this.getReadOnly();
			this.getMainWidget().setEnabled(isEnabled && !isReadOnly);
		}
	}
});

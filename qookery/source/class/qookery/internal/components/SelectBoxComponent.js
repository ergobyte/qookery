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

	extend: qookery.internal.components.AbstractSelectBoxComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {

		_createMainWidget: function() {
			var selectBox = new qx.ui.form.SelectBox();
			selectBox.setFormat(this.__getListItemLabel.bind(this));
			selectBox.addListener("changeSelection", function(event) {
				if(this._disableValueEvents) return;
				var newSelection = event.getData()[0];
				var model = newSelection ? newSelection.getModel() : null;
				if(model === qookery.internal.components.AbstractSelectBoxComponent._NULL_ITEM_MODEL) model = null;
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
			this._applySelectBoxAttributes(selectBox);
			return selectBox;
		},

		__getListItemLabel: function(listItem) {
			if(listItem == null) return "";
			return listItem.getLabel();
		},

		_updateUI: function(value) {
			if(value == null)
				value = qookery.internal.components.AbstractSelectBoxComponent._NULL_ITEM_MODEL;
			var matchingItem = null;
			var selectBox = this.getMainWidget();
			var listItems = selectBox.getChildren();
			var modelProvider = this.getForm().getModelProvider();
			for(var i = 0; i < listItems.length; i++) {
				var listItem = listItems[i];
				var item = listItem.getModel();
				if(!modelProvider.areEqual(item, value)) continue;
				matchingItem = listItem;
				break;
			}
			var showingPlaceholder = true;
			if(matchingItem != null) {
				selectBox.setSelection([ matchingItem ]);
				showingPlaceholder = value === qookery.internal.components.AbstractSelectBoxComponent._NULL_ITEM_MODEL;
			}
			else {
				selectBox.resetSelection();
			}
			if(showingPlaceholder && this.getRequired())
				selectBox.addState("showingPlaceholder");
			else
				selectBox.removeState("showingPlaceholder");
		},

		setSelection: function(itemNumber) {
			var selectablesItems = this.getMainWidget().getSelectables(true);
			if(!selectablesItems || selectablesItems[itemNumber] === undefined) return;
			this.getMainWidget().setSelection([ selectablesItems[itemNumber] ]);
		}
	}
});

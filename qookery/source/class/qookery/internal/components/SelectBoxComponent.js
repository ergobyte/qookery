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

	properties: {
		selection: {
			init: null,
			event: "changeSelection",
			apply: "_refreshSelection"
		}
	},
	
	members: {
		
		_createMainWidget: function(createOptions) {
			var selectBox = new qx.ui.form.SelectBox();
			this._applyLayoutProperties(selectBox, createOptions);
			selectBox.addListener("changeSelection", function(event) {
				var newSelection = event.getData()[0];
				var model = newSelection ? newSelection.getModel() : null;
				this.setSelection(model);
			}, this);
			return selectBox;
		},
		
		_refreshSelection: function(selection) {
			var selectionIdentity = this._getIdentityOf(selection);
			var listItems = this.getMainWidget().getChildren();
			for(var i = 0; i < listItems.length; i++) {
				var listItem = listItems[i];
				var item = listItem.getModel();
				var itemIdentity = this._getIdentityOf(item);
				if(selectionIdentity != itemIdentity) continue;
				this.getMainWidget().setSelection([ listItem ]);
				return;
			}
		},

		connect: function(controller, propertyPath) {
			controller.addTarget(this, "selection", propertyPath, true);
		},

		setItems: function(itemList) {
			var selectBox = this.getMainWidget();
			for(var i = 0; i < itemList.length; i++) {
				var model = itemList.getItem(i);
				var label = this._getLabelOf(model);
				var listItem = new qx.ui.form.ListItem(label, null, model);
				selectBox.add(listItem);
			}
		}
	},
	
	destruct: function() {
		this._disposeObjects("__listController");
	}
});

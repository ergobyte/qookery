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
qx.Class.define("qookery.mobile.components.SelectBoxComponent", {

	extend: qookery.mobile.components.EditableComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {

		__items: null,

		// Construction

		_createMainWidget: function() {
			var mainWidget = new qx.ui.mobile.form.SelectBox();
			mainWidget.addListener("changeSelection", function(event) {
				if(this._disableValueEvents) return;
				var data = event.getData();
				if(data)
					this.setValue(this.__items[data.index]);
				else
					this.setValue(null);
			}, this);
			this._applyWidgetAttributes(mainWidget);
			return mainWidget;
		},

		// Component implementation

		_updateUI: function(value) {
			var selectBox = this.getMainWidget();
			if(!value) {
				selectBox.resetSelection();
				return;
			}
			var labelOfValue = value.labelOf();
			for(var i = 0; i < this.__items.length; i++) {
				if(this.__items[i].labelOf() != labelOfValue) continue;
				selectBox.setSelection(i);
				return;
			}
		},

		// Public methods

		setItems: function(items) {
			var selectBox = this.getMainWidget();
			this.__items = items;
			var model = new qx.data.Array();
			items.forEach(function(item, index) {
				model.setItem(index, item.labelOf());
			}, this);
			selectBox.setModel(model);
		}
	}
});

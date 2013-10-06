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
	},

	members: {

		__listItemsMap: { },

		initialize: function(options) {
			if(!options || !options["items"]) return;
			var list = this.getMainWidget();
			list.removeAll();
			this.__listItemsMap = {};
			for(var property in options["items"]) {
				var item = new qx.ui.form.ListItem(options["items"][property]);
				this.__listItemsMap[property] = item;
				list.add(item);
			}
		},

		_createMainWidget: function(attributes) {
			var list = new qx.ui.form.List();
			list.setScrollbarY("on");
			list.addListener("changeSelection", this.__onChangeSelection, this);
			this._applyLayoutAttributes(list, attributes);
			return list;
		},

		_updateUI: function(value) {
			var selectedItem = this.__listItemsMap[value];
			if(selectedItem)
				this.getMainWidget().setSelection([ selectedItem ]);
			else
				this.getMainWidget().resetSelection();
		},

		select: function(value) {
			this._updateUI(value);
		},

		__onChangeSelection:function(e) {
			if(e.getData().length == 0 || this._disableValueEvents) return;
			var selectedItem = e.getData()[0];
      		this.setValue(qx.lang.Object.getKeyFromValue(this.__listItemsMap, selectedItem));
		}
	}
});

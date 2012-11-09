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

qx.Class.define("qookery.internal.components.ListComponent", {

	extend: qookery.internal.components.EditableComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
		this.__list = new qx.ui.form.List();
	},
	
	members: {
		
		__list: null,
		__listItemsMap: { },
		
		initialize: function(options) {
			if(!options || !options["itemsMap"]) return;
			this.__list.removeAll();
			this.__listItemsMap = {};
			for(var property in options["itemsMap"]) {
				var item = new qx.ui.form.ListItem(options["itemsMap"][property]);
				this.__listItemsMap[property] = item;
				this.__list.add(item);
			}
			this.__list.addListener("changeSelection", this.__onChangeSelection, this);
		},
		
		_createMainWidget: function(createOptions) {
			this.__list.setScrollbarY("on");
			this._applyLayoutProperties(this.__list, createOptions);
			return this.__list;
		},
		
		_updateUI: function(value) {
			if(!value || !this.__listItemsMap[value]) {
				this.__list.resetSelection();
				return;
			}
			this.__list.setSelection([this.__listItemsMap[value]]);
		},
		
		__onChangeSelection:function(e) {
			if(e.getData().length == 0 || this._disableValueEvents) return;
			var selectedItem = e.getData()[0];
      		this.setValue(qx.lang.Object.getKeyFromValue(this.__listItemsMap, selectedItem));
		}
	}
});

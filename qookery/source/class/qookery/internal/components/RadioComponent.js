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

qx.Class.define("qookery.internal.components.RadioComponent", {

	extend: qookery.internal.components.EditableComponent,
	
	events: {
		"changeSelection" : "qx.event.type.Data"
	},

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
		this.__manager = new qx.ui.form.RadioGroup();
		this.__manager.setAllowEmptySelection(true);
	},
	
	members: {
		
		__container: null,
		__manager: null,
		__radioButtonsMap: { },
		
		initialize: function(initOptions) {
			if(!initOptions || !initOptions["itemsMap"]) return;
			this.__emptyManager();
			for(var property in initOptions["itemsMap"]) {
				var radioButton = new qx.ui.form.RadioButton(initOptions["itemsMap"][property]);
				this.__radioButtonsMap[property] = radioButton;
				this.__container.add(radioButton);
				this.__manager.add(radioButton);
			}
			this.__manager.addListener("changeSelection", this.__onChangeSelection, this);
		},

		_createMainWidget: function(createOptions) {
			var mainLayout = new qx.ui.layout.HBox();
      		mainLayout.setSpacing(10);
			this.__container = new qx.ui.container.Composite(mainLayout);
			this._applyLayoutProperties(this.__container, createOptions);
			return this.__container;
		},
		
		_updateUI: function(value) {
			if(!value || !this.__radioButtonsMap[value]) {
				this.__manager.resetSelection();
				return;
			}
			this.__manager.setSelection([this.__radioButtonsMap[value]]);
		},
		
		__emptyManager: function() {
			for(var radioButton in this.__radioButtonsMap) {
				var item = this.__radioButtonsMap[radioButton];
				this.__manager.remove(radioButton);
				item.destroy();
			}
			this.__radioButtonsMap = { };
		},
		
		__onChangeSelection:function(e) {
			if(e.getData().length == 0) {
				this.fireDataEvent("changeSelection", null);
				return;
			}
			if (this._disableValueEvents) return;
			var selectedButton = e.getData()[0];
      		this.setValue(qx.lang.Object.getKeyFromValue(this.__radioButtonsMap, selectedButton));
      		this.fireDataEvent("changeSelection", this.getValue());
		}
	},
	
	destruct: function() {
		this.__emptyManager();
		this._disposeObjects('__manager');
	}
});

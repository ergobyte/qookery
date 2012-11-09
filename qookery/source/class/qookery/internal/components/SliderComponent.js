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

qx.Class.define("qookery.internal.components.SliderComponent", {
	
	extend: qookery.internal.components.EditableComponent,
	
	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},
	
	members: {
		
		__container: null,
		__group: null,
		
		initialize: function(initOptions) {
			if (!this.__group) return;
			var minimum = initOptions["minimum"] || 0;
			var maximum = initOptions["maximum"] || 100;
			var singleStep = initOptions["singleStep"] || 1;
			var pageStep = initOptions["pageStep"] || 5;
			this.__group.minimum.setValue(minimum.toString());
			this.__group.maximum.setValue(maximum.toString());
			this.__group.slider.set({
				minimum: minimum,
				maximum: maximum,
				singleStep: singleStep,
				pageStep: pageStep
			});
		},
		
		_createMainWidget: function(createOptions) {
			var grid = new qx.ui.layout.Grid();
			grid.setSpacing(5);
			grid.setColumnFlex(1, 1);
			grid.setRowAlign(0, "left", "middle");
			this.__container = new qx.ui.container.Composite(grid);
			var widget = new qx.ui.form.Slider();
			this.__group = this.__createSliderGroup(widget);
			this.__addGroupToContainer(this.__group);
			this._applyLayoutProperties(this.__container, createOptions);
			this.__group.slider.addListener("changeValue", function(event) {
				this.__group.value.setValue(this.__group.slider.getValue().toString());
				if(this._disableValueEvents) return;
				this.setValue(event.getData());
			}, this);
			return this.__container;
		},
		
		_updateUI: function(value) {
			if(!value) {
				this.__group.slider.resetValue();
				return;
			}
			this.__group.slider.setValue(value);
		},
		
		__addGroupToContainer: function(group) {
			this.__container.add(group.minimum, { row: 0, column: 0 });
			this.__container.add(group.slider, { row: 0, column: 1 });
			this.__container.add(group.maximum, { row: 0, column: 2 });
			this.__container.add(group.value, { row: 0, column: 3 });
		},
		
		__createSliderGroup: function(slider) {
			var group = {
				slider: slider,
				minimum: new qx.ui.basic.Label("Min: " + slider.getMinimum().toString()),
				maximum: new qx.ui.basic.Label("Max: " + slider.getMaximum().toString()),
				value: new qx.ui.form.TextField(slider.getValue().toString()).set({ readOnly: true })
			};
			return group;
		}
	}
});
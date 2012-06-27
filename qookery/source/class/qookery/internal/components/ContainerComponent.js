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
 * Base class for components that are containers of other components
 */
qx.Class.define("qookery.internal.components.ContainerComponent", {
	
	type : "abstract",
	extend: qookery.internal.components.BaseComponent,
	implement: [ qookery.IContainerComponent ],

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
		this.__children = [ ];
		this._currentRow = 0;
		this._currentColumn = 0;
		this._grabHorizontal = false;
		this._numOfColumns = null;
		this._layout = null;
		this._labelColumn =  null;
	},

	members: {

		__children: null,
		_numOfColumns: null,
		_layout: null,
		_currentRow: 0,
		_currentColumn: 0,
		_labelColumn: null,
		_grabHorizontal: false,

		setup: function() {
			var controls = this.getMainWidget().getChildren();
			var layout = this.getMainWidget().getLayout();
			for(var i=0; i < controls.length; i++) {
				
				if(controls[i] instanceof qx.ui.basic.Label) {
					this._labelColumn = this._currentColumn;
					layout.setColumnFlex(this._currentColumn, 0);
				}
				
				if(this._labelColumn != this._currentColumn)
					layout.setColumnFlex(this._currentColumn, 3);

				var createOptions = controls[i].getUserData('qookeryComponent').getCreateOptions();
				if(createOptions['horizontal-span']) {
					controls[i].setLayoutProperties({
						row: this._currentRow, 
						column: this._currentColumn, 
						colSpan: parseInt(createOptions['horizontal-span'])
					});
					this._currentColumn += parseInt(createOptions['horizontal-span']) - 1;
				}
				else if(controls[i] instanceof qx.ui.form.CheckBox) {
					controls[i].setLayoutProperties({
						row: this._currentRow, 
						column: this._currentColumn
					});
				
					this._currentColumn++;
				}
				else {
					controls[i].setLayoutProperties({ row: this._currentRow, column: this._currentColumn });
				}
				
				if(++this._currentColumn >= this._numOfColumns) {
					this._currentRow++;
					this._currentColumn = 0;
				}
			}
		},
		
		listChildren: function() {
			return this.__children;
		},

		/**
		 * Add a component as a child of this component
		 * 
		 * @param childComponent {qookery.IComponent} the component to add to this component
		 * 
		 * @throw an exception is thrown in case this component does not support children
		 */
		addChild: function(childComponent) {
			this.__children.push(childComponent);
			var widgets = childComponent.listWidgets();
			for(var i = 0; i < widgets.length; i++) {
				this.getMainWidget().add(widgets[i]);
			}
		}
	},

	destruct: function() {
		this._disposeArray("__children");
		this._layout = null;
		this._labelColumn = null;
	}
});

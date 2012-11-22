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
	
	type: "abstract",
	extend: qookery.internal.components.BaseComponent,
	implement: [ qookery.IContainerComponent ],

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
		this.__children = [ ];
	},

	members: {

		__children: null,
		__currentRow: 0,
		__currentColumn: 0,

		__layout: null,
		__columnCount: 1,

		create: function(createOptions) {
			this.__columnCount = createOptions['column-count'] || 1;
			this.__layout = new qx.ui.layout.Grid();
			var spacingX = createOptions['spacing-x'] || createOptions['spacing'] || 10;
			this.__layout.setSpacingX(spacingX);
			var spacingY = createOptions['spacing-y'] || createOptions['spacing'] || 10;
			this.__layout.setSpacingY(spacingY);
			var columnFlexes = createOptions['column-flexes'];
			if(columnFlexes) qx.util.StringSplit.split(columnFlexes, /\s+/).forEach(function(columnFlex, index) {
				this.__layout.setColumnFlex(index, parseInt(columnFlex));
			}, this);
			var rowFlexes = createOptions['row-flexes'];
			if(rowFlexes) qx.util.StringSplit.split(rowFlexes, /\s+/).forEach(function(rowFlex, index) {
				this.__layout.setRowFlex(index, parseInt(rowFlex));
			}, this);
			this._widgets[0] = this._createContainerWidget(createOptions);
			this._widgets[0].setLayout(this.__layout);
			this.base(arguments, createOptions);
		},
		
		_createContainerWidget: function(createOptions) {
			throw new Error("Override _createContainerWidget() to provide implementation specific code");
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
			var container = this.getMainWidget();
			var widgets = childComponent.listWidgets();
			for(var i = 0; i < widgets.length; i++) {
				var widget = widgets[i];
				var layoutProperties = widget.getLayoutProperties();
				// TODO automatic cell positioning does not support row span yet
				var colSpan = layoutProperties["colSpan"] || 1;
				widget.setLayoutProperties({
					row: this.__currentRow,
					column: this.__currentColumn
				});
				this.__currentColumn += colSpan;
				if(this.__columnCount != "auto" && this.__currentColumn >= this.__columnCount) {
					this.__currentColumn = 0;
					this.__currentRow++;
				}
				container.add(widget);
			}
		}
	},

	destruct: function() {
		this._disposeArray("__children");
		this._disposeObjects("__layout");
	}
});

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
		__rowArray: null,

		create: function(attributes) {
			this.base(arguments, attributes);
			this.__columnCount = attributes["column-count"] || 1;
			if(this.__columnCount === "none") return;
			if(this.__columnCount !== "auto") {
				this.__rowArray = [ ];
				for(var i = 0; i < this.__columnCount; i++) this.__rowArray.push(0);
			}
			this.__layout = new qx.ui.layout.Grid();
			var spacing = attributes["spacing"];
			if(spacing !== undefined) {
				this.__layout.setSpacingX(spacing);
				this.__layout.setSpacingY(spacing);
			}
			else {
				var spacingX = attributes["spacing-x"];
				this.__layout.setSpacingX(spacingX !== undefined ? spacingX : 10);
				var spacingY = attributes["spacing-y"];
				this.__layout.setSpacingY(spacingY !== undefined ? spacingY : 10);
			}
			var columnFlexes = attributes["column-flexes"];
			if(columnFlexes) qx.util.StringSplit.split(columnFlexes, /\s+/).forEach(function(columnFlex, index) {
				this.__layout.setColumnFlex(index, parseInt(columnFlex, 10));
			}, this);
			var rowFlexes = attributes["row-flexes"];
			if(rowFlexes) qx.util.StringSplit.split(rowFlexes, /\s+/).forEach(function(rowFlex, index) {
				this.__layout.setRowFlex(index, parseInt(rowFlex, 10));
			}, this);
			this.getMainWidget().setLayout(this.__layout);
		},

		_createWidgets: function(attributes) {
			return [ this._createContainerWidget(attributes) ];
		},

		_createContainerWidget: function(attributes) {
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
		add: function(childComponent, display) {
			this.__children.push(childComponent);
			if(display == "none") return;
			var container = this.getMainWidget();
			var widgets = childComponent.listWidgets();
			for(var i = 0; i < widgets.length; i++) {
				var widget = widgets[i];
				if(this.__layout != null) {
					var layoutProperties = widget.getLayoutProperties();
					var colSpan = layoutProperties["colSpan"] || 1;
					var rowSpan = layoutProperties["rowSpan"] || 1;
					if(this.__columnCount == "auto") {
						widget.setLayoutProperties({
							row: 0,
							column: this.__currentColumn,
							colSpan: colSpan
						});
						this.__currentColumn += colSpan;
					}
					else {
						while(this.__rowArray[this.__currentColumn] > 0) {
							this.__rowArray[this.__currentColumn]--;
							this.__currentColumn++;
							if(this.__currentColumn >= this.__columnCount) {
								this.__currentColumn = 0;
								this.__currentRow++;
							}
						}
						widget.setLayoutProperties({
							row: this.__currentRow,
							column: this.__currentColumn,
							colSpan: colSpan,
							rowSpan: rowSpan
						});
						for(var j = 0; j < colSpan; j++) {
							this.__rowArray[this.__currentColumn] += rowSpan - 1;
							this.__currentColumn++;
						}
						if(this.__currentColumn >= this.__columnCount) {
							this.__currentColumn = 0;
							this.__currentRow++;
						}
					}
				}
				container.add(widget);
			}
		},

		remove: function(childComponent) {
			var container = this.getMainWidget();
			var widgets = childComponent.listWidgets();
			for(var i = 0; i < widgets.length; i++)
				container.remove(widgets[i]);
		},

		contains: function(childComponent) {
			var container = this.getMainWidget();
			var widgets = childComponent.listWidgets();
			for(var i = 0; i < widgets.length; i++)
				if(container.indexOf(widgets[i]) != -1) return true;
			return false;
		}
	},

	destruct: function() {
		this._disposeArray("__children");
		this._disposeObjects("__layout");
	}
});

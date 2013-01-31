/*
 *	Copyright (C) Ergobyte Informatics S.A. - All Rights Reserved
 *
 * 	This material is proprietary to Ergobyte. The methods and techniques described herein are considered trade secrets
 *	and/or confidential. Reproduction or distribution, in whole or in part, is forbidden except by express written permission.
 *
 *	$Id: MainToolBar.js 95 2013-01-10 23:46:01Z geonik $
 */

qx.Class.define("qookery.internal.components.ToolBarComponent", {

	extend: qookery.internal.components.BaseComponent,
	implement: [ qookery.IContainerComponent ],
	
	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
		this.__children = [ ];
		this.__flexes = [];
	},

	members: {
		
		__children: null,
		__toolbar: null,
		__flexes: null,
		
		create: function(attributes) {
			this.__toolbar = new qx.ui.toolbar.ToolBar();
			this._applyLayoutAttributes(this.__toolbar, attributes);
			this._widgets[0] = this.__toolbar;
			this.base(arguments, attributes);
			if(attributes['column-flexes'] !== undefined) {
				qx.util.StringSplit.split(attributes['column-flexes'], /\s+/).forEach(function(columnFlex) {
					this.__flexes.push(parseInt(columnFlex));
				}, this);
			}
		},
		
		listChildren: function() {
			return this.__children;
		},
		
		add: function(childComponent, display) {
			var index = this.__children.length;
			this.__children.push(childComponent);
			var part = childComponent.getMainWidget();
			var flex = this.__flexes[index];
			this.__toolbar.add(part, flex !== undefined ? { flex: flex } : null);
		},
		
		remove: function(component) {
			//TODO
		},
		
		contains: function(component) { 
			//TODO
		}
	}
});

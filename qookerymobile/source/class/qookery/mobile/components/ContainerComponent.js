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
qx.Class.define("qookery.mobile.components.ContainerComponent", {

	type: "abstract",
	extend: qookery.internal.components.Component,
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

		// Construction

		create: function(attributes) {
			this.base(arguments, attributes);
			this.getMainWidget().setLayout(new qx.ui.mobile.layout.VBox());
		},

		_createWidgets: function() {
			return [ this._createContainerWidget() ];
		},

		_createContainerWidget: function() {
			throw new Error("Override _createContainerWidget() to provide implementation specific code");
		},

		// Public methods

		listChildren: function() {
			return this.__children;
		},

		add: function(childComponent) {
			this.__children.push(childComponent);
			var container = this.getMainWidget();
			var widgets = childComponent.listWidgets();
			for(var i = 0; i < widgets.length; i++) {
				container.add(widgets[i]);
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
		},

		validate: function() {
			if(!this.getEnabled()) return null;
			var errors = [ ];
			var children = this.listChildren();
			for(var i = 0; i < children.length; i++) {
				var child = children[i];
				var childError = child.validate();
				if(childError == null) continue;
				errors.push(childError);
			}
			if(errors.length === 0) return null;
			if(errors.length === 1) return errors[0];
			return new qookery.util.ValidationError(this, null, errors);
		}
	},

	destruct: function() {
		this._disposeArray("__children");
		this._disposeObjects("__layout");
	}
});

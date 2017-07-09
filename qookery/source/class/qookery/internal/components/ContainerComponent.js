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

		_containerWidget: null,
		__children: null,
		__layout: null,

		// Metadata

		getAttributeType: function(attributeName) {
			switch(attributeName) {
			case "layout": return "QName";
			case "reverse": return "Boolean";
			}
			return this.base(arguments, attributeName);
		},

		// Construction

		create: function(attributes) {
			this.base(arguments, attributes);
			var layoutName = this.getAttribute("layout", "{http://www.qookery.org/ns/Form}grid");
			if(layoutName === "none") return;
			var layoutFactory = qookery.Qookery.getRegistry().get(qookery.IRegistry.P_LAYOUT_FACTORY, layoutName, true);
			var layout = this.__layout = layoutFactory.createLayout(attributes);
			this.getContainerWidget().setLayout(layout);
		},

		_createWidgets: function(attributes) {
			this._containerWidget = this._createContainerWidget(attributes);
			return [ this._containerWidget ];
		},

		_createContainerWidget: function(attributes) {
			throw new Error("Override _createContainerWidget() to provide implementation specific code");
		},

		getContainerWidget: function() {
			return this._containerWidget;
		},

		listChildren: function() {
			return this.__children;
		},

		add: function(component) {
			this._addChildComponent(component);
			var container = this.getContainerWidget();
			var widgets = component.listWidgets();
			for(var i = 0; i < widgets.length; i++) {
				var widget = widgets[i];
				if(this.__layout != null && qx.lang.Type.isFunction(this.__layout.configureWidget))
					this.__layout.configureWidget(widget);
				container.add(widget);
			}
		},

		remove: function(component) {
			var container = this.getContainerWidget();
			var widgets = component.listWidgets();
			for(var i = 0; i < widgets.length; i++)
				container.remove(widgets[i]);
			this._removeChildComponent(component);
		},

		contains: function(component) {
			return qx.lang.Array.contains(this.__children, component);
		},

		validate: function() {
			if(!this.getEnabled() || this.getVisibility() !== "visible") return null;
			var errors = [ ];
			var children = this.listChildren();
			for(var i = 0; i < children.length; i++) {
				var child = children[i];
				var childError = child.validate();
				if(childError == null) continue;
				errors.push(childError);
			}
			if(errors.length == 0) return null;
			if(errors.length == 1) return errors[0];
			return new qookery.util.ValidationError(this, null, errors);
		},

		// Internals

		_addChildComponent: function(component) {
			this.__children.push(component);
		},

		_removeChildComponent: function(component) {
			qx.lang.Array.remove(this.__children, component);
		}
	},

	destruct: function() {
		this._disposeArray("__children");
		this._disposeObjects("__layout");
	}
});

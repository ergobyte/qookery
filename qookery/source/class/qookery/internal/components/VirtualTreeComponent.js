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

qx.Class.define("qookery.internal.components.VirtualTreeComponent", {

	extend: qookery.internal.components.EditableComponent,

	events: {
		"changeSelection": "qx.event.type.Data"
	},

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {

		__delegate: null,

		_createMainWidget: function(attributes) {
			var virtualTree = new qx.ui.tree.VirtualTree();
			if(attributes["child-property"]) virtualTree.setChildProperty(attributes["child-property"]);
			if(attributes["hide-root"]) virtualTree.setHideRoot(true);
			if(attributes["icon-property"]) virtualTree.setIconPath(attributes["icon-property"]);
			if(attributes["label-path"]) virtualTree.setLabelPath(attributes["label-path"]);

			virtualTree.getSelection().addListener("change", function(e) {
				this.fireDataEvent("changeSelection", virtualTree.getSelection().getItem(0));
			}, this);

			return virtualTree;
		},

		setup: function(attributes) {
			if(this.__delegate !== null) this.getMainWidget().setDelegate(this.__delegate);
			this.base(arguments, attributes);
		},

		parseXmlElement: function(elementName, xmlElement) {
			switch(elementName) {
			case "{http://www.qookery.org/ns/Form}virtual-tree-delegate":
				var delegateClassName = qookery.util.Xml.getAttribute(xmlElement, "class", Error);
				var delegateClass = qx.Class.getByName(delegateClassName);
				this.__delegate = new delegateClass();
				return true;
			}
			return false;
		},

		getAttributeType: function(attributeName) {
			switch(attributeName) {
			case "child-property": return "String";
			case "hide-root": return "Boolean";
			case "icon-property": return "String";
			case "label-path": return "String";
			default: return this.base(arguments, attributeName);
			}
		},

		setIconOptions: function(iconOptions) {
			this.getMainWidget().setIconOptions(iconOptions);
		},

		_updateUI: function(value) {
			this.getMainWidget().setModel(this.getValue());
		}

	},

	destruct: function() {
		this._disposeObjects("__delegate");
	}
});

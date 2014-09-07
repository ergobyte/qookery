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
 * @ignore(ace.*)
 */
qx.Class.define("qookerydemo.ui.XmlEditor", {

	extend: qx.ui.container.Composite,

	construct: function() {
		this.base(arguments);
		this.setPadding(10);
		this.setLayout(new qx.ui.layout.VBox(10));
		this.add(this.getChildControl("heading"));
		this.add(this.getChildControl("editor"), { flex: 1 });
	},

	members: {

		__ace: null,

		getCode: function() {
			if(!this.__ace) { return null; }
			return this.__ace.getSession().getValue();
		},

		setCode: function(xmlCode) {
			if(!this.__ace) { return; }
			this.__ace.getSession().setValue(xmlCode);
			this.__ace.renderer.scrollToX(0);
			this.__ace.renderer.scrollToY(0);
			this.__ace.selection.moveCursorFileStart();
		},

    	_createChildControlImpl: function(id, hash) {
			switch(id) {
			case "heading":
				var control = new qx.ui.basic.Label("Form XML").set({ font: "bold" });
				return control;
			case "editor":
				var control = new qx.ui.core.Widget();
				control.setMinWidth(400);
				control.setWidth(800);
				control.addListenerOnce("appear", function() {
					qx.event.Timer.once(function() {
						var aceContainer = this.getChildControl("editor").getContentElement().getDomElement();
						var aceEditor = this.__ace = ace.edit(aceContainer);
						var aceSession = aceEditor.getSession();
						aceSession.setMode("ace/mode/xml");
						aceSession.setTabSize(4);
						qx.core.Init.getApplication().loadDemo(qookerydemo.Application.DEMOS[0]);
					}, this, 500);
				}, this);
				control.addListener("resize", function() {
					if(!this.__ace) { return null; }
					// use a timeout to let the layout queue
					// apply its changes to the dom
					qx.event.Timer.once(function() {
						this.__ace.resize();
					}, this, 0);
				}, this);
				return control;
			}
			return this.base(arguments, id, hash);
		}
	},

	destruct: function() {
		this.__ace = null;
	}
});

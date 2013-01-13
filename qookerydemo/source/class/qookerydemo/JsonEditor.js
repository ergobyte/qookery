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

qx.Class.define("qookerydemo.JsonEditor", {

	extend: qx.ui.container.Composite,

	construct: function() {
		this.base(arguments);
		this.setPadding(10);
		this.setLayout(new qx.ui.layout.VBox(10));
		this.add(this.getChildControl("heading"));
		this.add(this.getChildControl("button-bar"));
		this.add(this.getChildControl("editor"), { flex: 1 });
	},

	members: {

		__ace: null,
		__dataAsQxObject: null,

		getCode: function() {
			if(!this.__ace) return null;
			return this.__ace.getSession().getValue();
		},

		setCode: function(jsonCode) {
			if(!this.__ace) return;
			this.__ace.getSession().setValue(jsonCode);
			this.__ace.renderer.scrollToX(0);
			this.__ace.renderer.scrollToY(0);
			this.__ace.selection.moveCursorFileStart();
		},

    	_createChildControlImpl: function(id, hash) {
			switch(id) {
			case "heading":
		 		var control = new qx.ui.basic.Label("Form JSON").set({ font: "bold" });
				return control;
			case "button-bar":
		 		var control = new qx.ui.container.Composite(new qx.ui.layout.HBox(5));
				control.add(this.getChildControl("json-to-form-button"));
				control.add(this.getChildControl("form-to-json-button"));
				control.add(this.getChildControl("clear-form-button"));
				return control;
			case "json-to-form-button":
				var control = new qx.ui.form.Button("Load Model into Form");
				control.addListener("execute", function(e) {
		    		var dataAsJson = this.getCode();
					var dataAsJsObject = qx.lang.Json.parse(dataAsJson);
					this.__dataAsQxObject = qx.data.marshal.Json.createModel(dataAsJsObject, true);
					qx.core.Init.getApplication().setFormModel(this.__dataAsQxObject);
		    	}, this);
				return control;
			case "form-to-json-button":
				var control = new qx.ui.form.Button("Recreate JSON");
		    	control.addListener("execute", function(e) {
					var dataAsJson = qx.util.Serializer.toJson(this.__dataAsQxObject);
					this.setCode(dataAsJson);
		    	}, this);
				return control;
			case "clear-form-button":
				var control = new qx.ui.form.Button("Unload Model from Form");
		    	control.addListener("execute", function(e) {
					qx.core.Init.getApplication().setFormModel(null);
		    	}, this);
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
						aceSession.setMode("ace/mode/json");
						aceSession.setTabSize(4);
					}, this, 500);
				}, this);
				control.addListener("resize", function() {
					if(!this.__ace) return null;
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

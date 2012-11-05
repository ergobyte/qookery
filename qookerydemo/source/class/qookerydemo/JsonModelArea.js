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

qx.Class.define("qookerydemo.JsonModelArea", {

	extend: qx.ui.container.Composite,

	construct: function() {
		this.base(arguments);
		
		this.__headingLabel = new qx.ui.basic.Label("Source Json Model").set({ font: "bold" });
		
		this.__modelLabel = new qx.ui.basic.Label();
		this.__loadButton = new qx.ui.form.Button("Load Model");
		this.__unloadButton = new qx.ui.form.Button("Unload Model");
		this.__loadFromFormButton = new qx.ui.form.Button("Update");
		this.__loadButton.set({ enabled: false });
		this.__unloadButton.set({ enabled: false });
		this.__loadFromFormButton.set({ enabled: false });
		this.__modelLabel.set({ rich: true });
	
		var layout = new qx.ui.layout.Grid();
		this.setLayout(layout);
		this.add(this.__headingLabel, { row: 0, column: 0 });
		this.add(this.__loadButton, { row: 1, column: 0 });
		this.add(this.__unloadButton, { row: 1, column: 1 });
		this.add(this.__loadFromFormButton, { row: 1, column: 2 });
		this.add(this.__modelLabel, { row: 2, column: 0, colSpan: 3, rowSpan: 3 });
		
		this.__loadButton.addListener("execute", function(e) {
			this.__loadFromFormButton.set({ enabled: true });
    		var dataAsString = this.__modelLabel.getValue();
			var dataAsJsObject = qx.lang.Json.parse(dataAsString);
			this.__dataAsQxObject = qx.data.marshal.Json.createModel(dataAsJsObject, true);
			qx.core.Init.getApplication().setFormModel(this.__dataAsQxObject);
    	}, this);
    	
    	this.__unloadButton.addListener("execute", function(e) {
			qx.core.Init.getApplication().setFormModel(null);
			this.__loadFromFormButton.set({ enabled: false });
    	}, this);
    	
    	this.__loadFromFormButton.addListener("execute", function(e) {
			var dataAsJsObject = qx.util.Serializer.toJson(this.__dataAsQxObject);
			this.__modelLabel.setValue(dataAsJsObject);
		
    	}, this);
	},
	
	members: {

		__headingLabel: null,
		__modelLabel: null,
		__loadButton: null,
		__unloadButton: null,
		__loadFromFormButton: null,
		__dataAsQxObject:null,
		
    	setCode : function(text) {
    		var bool = (text == "") ? false : true;
    		this.__loadButton.set({enabled: bool});
    		this.__unloadButton.set({ enabled: bool });
    		this.__modelLabel.setValue(text);
    	}
	}
});

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

qx.Class.define("qookerydemo.Editor", {

	extend: qx.ui.container.Composite,
	include: qx.ui.core.MBlocker,
	
	construct: function() {
		this.base(arguments);
		var layout = new qx.ui.layout.VBox();
		this.setLayout(layout);
		
		var caption = new qx.ui.basic.Label("Xml Code").set({
			font: "bold",
			padding: 10,
			allowGrowX: true,
			allowGrowY: true
		});
		this.add(caption, {flex: 0} );
		
		this.__textArea = new qx.ui.form.TextArea().set({
			wrap: false,
			font: qx.bom.Font.fromString("8pt monospace"),
			decorator: "separator-vertical",
			backgroundColor: "white",
			padding: [ 0, 0, 0, 5 ],
			width: 800,
			minWidth:400,
			margin:10
		});
		
		this.__textArea.setAllowStretchX(true, true);
		this.__textArea.setAllowStretchY(true, true);
		this.add(this.__textArea, {flex: 1});
	},
	
	members: {

		__textArea: null,

		setCode: function(xmlCode) {
			this.__textArea.setValue(xmlCode);
		},

		getCode: function() {
			return this.__textArea.getValue();
		}
	},
	
	destruct: function() {
		this._disposeObjects("__textArea");
	}
});

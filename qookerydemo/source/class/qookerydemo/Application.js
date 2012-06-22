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

/*
#asset(qookerydemo/*)
*/

qx.Class.define("qookerydemo.Application", {

	extend: qx.application.Standalone,

	members: {

		__toolBar: null,
		__editor: null,
		__riaArea: null,
		
		main: function() {
			this.base(arguments);
			
			if(qx.core.Environment.get("qx.debug")) {
				qx.log.appender.Native;
				qx.log.appender.Console;
			}
			var layout = new qx.ui.layout.VBox();
			
			var mainContainer = new qx.ui.container.Composite(layout);
			this.getRoot().add(mainContainer, { edge: 0 });
			
			this.__toolbar = new qookerydemo.Toolbar();
			mainContainer.add(this.__toolbar, { flex: 0 });
			
			this.__editor = new qookerydemo.Editor();
			this.__riaArea = new qookerydemo.ResultArea();
			
			var splitter = new qx.ui.splitpane.Pane("horizontal");
			splitter.setDecorator(null); // remove the 3px broder
			var viewLayout = new qx.ui.layout.HBox(); 
			var viewsContainer = new qx.ui.container.Composite(viewLayout);
			
			splitter.add(this.__editor, 0);
			splitter.add(this.__riaArea, 1);
			
			viewsContainer.add(splitter, { flex: 1 });
			mainContainer.add(viewsContainer, { flex: 1 });
			this.__toolbar.addListener("run", this.runCode, this);
			
			qx.dom.Element.remove(document.getElementById('splash'));
		},

		runCode: function(event) {
			var xmlCode = this.__editor.getCode();
			if(!xmlCode) {
				alert("You must supply some code");
				return;
			}
			this.__riaArea.loadForm(xmlCode);
		},

		setEditor: function(text) {
			this.__editor.setCode(text);
		}
	},

	destruct: function() {
		this._disposeObjects("__toolbar", "__editor", "__riaArea" );
	}
});

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
		__xmlEditor: null,
		__resultArea: null,
		__jsonEditor: null,

		main: function() {
			this.base(arguments);
			if(qx.core.Environment.get("qx.debug")) {
				qx.log.appender.Native;
				qx.log.appender.Console;
			}

			this.__toolbar = new qookerydemo.Toolbar();
			this.__xmlEditor = new qookerydemo.XmlEditor();
			this.__jsonEditor = new qookerydemo.JsonEditor();
			this.__resultArea = new qookerydemo.ResultArea();

			var verticalSplitter = new qx.ui.splitpane.Pane("vertical");
			verticalSplitter.setDecorator(new qx.ui.decoration.Uniform(0));
			verticalSplitter.setOffset(0);
			verticalSplitter.add(this.__xmlEditor);
			verticalSplitter.add(this.__jsonEditor);

			var horizontalSplitter = new qx.ui.splitpane.Pane("horizontal");
			horizontalSplitter.add(verticalSplitter);
			horizontalSplitter.add(this.__resultArea);

			var mainContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox());
			mainContainer.add(this.__toolbar, { flex: 0 });
			mainContainer.add(horizontalSplitter, { flex: 1 });
			this.getRoot().add(mainContainer, { edge: 0 });

			qx.dom.Element.remove(document.getElementById('splash'));
		},

		runCode: function() {
			var xmlCode = this.__xmlEditor.getCode();
			if(!xmlCode) return;
			this.__resultArea.loadForm(xmlCode);
		},

		setModelAreaCode: function(code) {
			this.__jsonEditor.setCode(code);
		},

		setXmlEditorCode: function(code) {
			this.__xmlEditor.setCode(code);
		},

		setFormModel: function(model) {
			this.__resultArea.getFormComponent().setModel(model);
		}
	},

	destruct: function() {
		this._disposeObjects("__toolbar", "__xmlEditor", "__jsonEditor", "__resultArea" );
	}
});

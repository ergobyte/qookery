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

qx.Class.define("qookerydemo.XmlEditor", {

	extend: qx.ui.container.Composite,
	
	construct: function() {
		this.base(arguments);
		
		this.__headingLabel = new qx.ui.basic.Label("Source XML Form").set({ font: "bold" });
		
		this.__editor = new qx.ui.core.Widget();
		this.__editor.setMinWidth(400);
		this.__editor.setWidth(800);
		this.__editor.addListenerOnce("appear", function() {
			this.__onEditorAppear();
		}, this);

		this.setPadding(10);
		this.setLayout(new qx.ui.layout.VBox(10));
		this.add(this.__headingLabel, { flex: 0 });
		this.add(this.__editor, { flex: 1 });
	},
	
	members: {

		__headingLabel: null,
		__editor: null,
		__highlightEnabled: false,
		__ace: null,

		getCode: function() {
			if(!this.__ace) return null;
			return this.__ace.getSession().getValue();
		},

		setCode: function(xmlCode) {
			if(!this.__ace) return;
			this.__ace.getSession().setValue(xmlCode);
			this.__ace.renderer.scrollToX(0);
			this.__ace.renderer.scrollToY(0);
			this.__ace.selection.moveCursorFileStart();
		},

		__onEditorAppear: function() {
			qx.event.Timer.once(function() {
				var container = this.__editor.getContentElement().getDomElement();
				var editor = this.__ace = ace.edit(container);
				var XmlScriptMode = require("ace/mode/xml").Mode;
				editor.getSession().setMode(new XmlScriptMode());
				var session = editor.getSession();
				session.setTabSize(4);
				var self = this;
				this.__editor.addListener("resize", function() {
					// use a timeout to let the layout queue
					// apply its changes to the dom
					window.setTimeout(function() {
						self.__ace.resize();
					}, 0);
				});
			}, this, 500);
		}
	},
	
	destruct: function() {
		this._disposeObjects("__headingLabel", "__editor");
		this.__ace = null;
	}
});

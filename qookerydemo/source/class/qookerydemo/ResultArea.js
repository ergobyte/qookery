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

qx.Class.define("qookerydemo.ResultArea", {

	extend: qookery.internal.components.Component,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {

		__form: null,

		_createWidgets: function() {
			var scroll = new qx.ui.container.Scroll();
			this._applyWidgetAttributes(scroll);
			return [ scroll ];
		},

		loadForm: function(formXml) {
			if(this.getQxObject("result") != null)
				this.removeOwnedQxObject("result");
			this._disposeObjects("__form");
			var xmlDocument = qx.xml.Document.fromString(formXml);
			var parser = qookery.Qookery.createFormParser();
			try {
				this.__form = parser.parseXmlDocument(xmlDocument);
				this.__form.addListenerOnce("close", function() {
					this._disposeObjects("__form");
				}, this);
				this.getMainWidget().add(this.__form.getMainWidget());
				this.addOwnedQxObject(this.__form, "result");
				this.__form.markAsReady();
			}
			catch(e) {
				this.error("Error creating form window", e);
			}
			finally {
				parser.dispose();
			}
		},

		getFormComponent: function() {
			return this.__form;
		},

		getModel: function() {
			return this.__form.getModel();
		},

		setModel: function(model) {
			this.__form.setModel(model);
		}
	},

	destruct: function() {
		this._disposeObjects("__form");
	}
});

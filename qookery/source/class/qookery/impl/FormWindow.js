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

qx.Class.define("qookery.impl.FormWindow", {

	extend: qx.ui.window.Window,

	/**
	 * Create a new Qookery form window
	 *
	 * @param title { String } title of the window
	 * @param icon { uri } icon of the window
	 *
	 * @return the newly created Qookery window instance
	 */
	construct: function(caption, icon) {
		this.base(arguments, caption, icon);
		this.setLayout(new qx.ui.layout.VBox());
		this.set({ modal: true, showMinimize: false, showMaximize: false });
	},

	members: {

		__formComponent: null,
		__buttonsContainer: null,
		__disposeForm: false,

		/**
		 * Create and open Qookery window
		 *
		 * @param formXml {String} the XML source of the form to create
		 * @param model {Object} an initial model to set, or <code>null</code> if not needed
		 */
		createAndOpen: function(formXml, model, variables) {
			var xmlDocument = qx.xml.Document.fromString(formXml);
			var parser = qookery.Qookery.createFormParser(variables);
			try {
				this.__formComponent = parser.parseXmlDocument(xmlDocument);
				this.__disposeForm = true;
				this.openForm(this.__formComponent, model);
			}
			catch(e) {
				this.error(qx.lang.String.format("Error creating form window: %1", [ e ]));
				if(e.stack) qx.log.Logger.error(e.stack);
			}
			finally {
				parser.dispose();
			}
		},
		
		openForm: function(formComponent, model) {
			this.__formComponent = formComponent;
			formComponent.addListenerOnce("close", function(event) {
				formComponent.setModel(null);
				this.destroy();
			}, this);
			var formTitle = formComponent.getTitle();
			if(formTitle && !this.getCaption()) this.setCaption(formTitle);
			var formIcon = formComponent.getIcon();
			if(formIcon && !this.getIcon()) this.setIcon(formIcon);
			if(model) formComponent.setModel(model);
			this.add(formComponent.getMainWidget(), { flex: 1 });
			this.add(this._getButtonsContainer());
			this.center();
			this.open();
			formComponent.executeAction("appear");
		},

		_getButtonsContainer: function() {
			if(this.__buttonsContainer == null) {
				var buttonsLayout = new qx.ui.layout.Grid();
				//buttonsLayout.setReversed(true);
				buttonsLayout.setSpacing(10);
				this.__buttonsContainer = new qx.ui.container.Composite(buttonsLayout);
				this.__buttonsContainer.setLayout(buttonsLayout);
				this._createButtons(this.__buttonsContainer, buttonsLayout);
			}
			return this.__buttonsContainer;
		},

		_createButtons: function(buttonsContainer) {
			// Override to add button to the window
		},

		_onCloseButtonClick: function(event) {
			this.__formComponent.close();
	    },

	    getFormComponent: function() {
			return this.__formComponent;
		}
	},

	destruct: function() {
		if(this.__disposeForm)
			this._disposeObjects("__formComponent");
		else
			this.remove(this.__formComponent.getMainWidget());
	}
});

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
	 * @returns the newly created Qookery window instance
	 */
	construct: function(title, icon) {
		this.base(arguments);
		this.set({ modal: true, showMinimize: false, showMaximize: false, caption: title, icon: icon });
		this.setLayout(new qx.ui.layout.VBox());
	},

	members: {

		__formComponent: null,
		__buttonsContainer: null,

		/**
		 * Create and open Qookery window
		 *
		 * @param formUrl {String} the URL of the form XML
		 * @param model {Object} an initial model to set, or <code>null</code> if not needed
		 */
		createAndOpen: function(xmlCode, model) {

			var that = this;
			this.__formComponent = qookery.contexts.Qookery.createFormComponent(xmlCode, this, { flex: 1 }, function(event) {
				that.destroy();
			}, this);

			if(!this.__formComponent) return;
			if(model) this.__formComponent.setModel(model);
			this.add(this._getButtonsContainer());
			this.center();
			this.open();
			this.__formComponent.executeAction("appear");
		},

		_getButtonsContainer: function() {
			if(this.__buttonsContainer == null) {
				var buttonsLayout = new qx.ui.layout.HBox();
				buttonsLayout.setReversed(true);
				buttonsLayout.setSpacing(10);
				this.__buttonsContainer = new qx.ui.container.Composite(buttonsLayout);
				this.__buttonsContainer.setLayout(buttonsLayout);
				this._createButtons(this.__buttonsContainer);
			}
			return this.__buttonsContainer;
		},

		_createButtons: function(buttonsContainer) {
			// Override to add button to the window
		},

	    _onCloseButtonClick: function(event) {
	    	this.__formComponent.dispose();
	    },

	    getFormComponent: function() {
			return this.__formComponent;
		}
	},

	destruct: function() {
		this._disposeObjects("__formComponent");
		this._disposeChildControls();
	}
});

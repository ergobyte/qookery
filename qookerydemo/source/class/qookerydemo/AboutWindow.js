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

qx.Class.define("qookerydemo.AboutWindow", {

	extend: qx.ui.window.Window,
	
	statics: {
		open: function() {
			var window = new qookerydemo.AboutWindow();
			window.addListener("disappear", function() {
				window.destroy();
				window = null;
			});
		}
	}, 
	
	construct: function() {
		this.base(arguments, "Qookery Demo", "resource/qookerydemo/icons/24/about.png");
		this.set({ modal: true, showMinimize: false, showMaximize: false});
		var grid = new qx.ui.layout.Grid();
		grid.setColumnFlex(0, 1);
      	grid.setRowFlex(0, 1);
		this.setLayout(grid);
		this.__xmlInit();
	},
	
	members: {
		
		__formComponent: null,
		
		__xmlInit: function() {
			var formUrl = "aboutDialog.xml";
			var that = this;
			qookerydemo.Utils.getFile(formUrl, function (event, req) {
				var data =  req.responseText;
				var xmlDocument = qx.xml.Document.fromString(data);
				var parser = qookery.Qookery.getInstance().createNewParser();
				try {
					that.__formComponent = parser.create(xmlDocument, that, { row: 0, column: 0});
					that.__formComponent.addListener("formClose", function() {
						that.close();
						qx.log.Logger.debug(that, qx.lang.String.format("Form window '%1' destroyed", [ formUrl ]));
					}, that);
					that.center();
					that.open();
					that.__formComponent.fireEvent("formOpen", qx.event.type.Event, null);
					qx.log.Logger.debug(that, qx.lang.String.format("Form window '%1' created", [ formUrl ]));
				}
				catch(e) {
					qx.log.Logger.error(that, qx.lang.String.format("Error creating form window '%1'", [ formUrl ]));
					qx.log.Logger.error(e.stack);
				}
				finally {
					parser.dispose();
				}
			}, this);
		}
	}
});

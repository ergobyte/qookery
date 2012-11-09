
qx.Class.define("qookery.impl.QookeryContext", {
	
	type: "static",
	
	statics: {
		
		createFormComponent: function(xmlCode, parentComposite, layoutData, formCloseHandler) {
			var xmlDocument = qx.xml.Document.fromString(xmlCode);
			var parser = qookery.Qookery.getInstance().createNewParser();
			try {
				var formComponent = parser.create(xmlDocument, parentComposite, layoutData);
				formComponent.addListener("closeForm", function(event) {
					if(formCloseHandler) formCloseHandler(event);
					qx.log.Logger.debug(parentComposite, qx.lang.String.format("Form window destroyed", [ ]));
				});
				formComponent.fireEvent("openForm", qx.event.type.Event, null);
				qx.log.Logger.debug(parentComposite, qx.lang.String.format("Form window created", [ ]));
				return formComponent;
			}
			catch(e) {
				qx.log.Logger.error(parentComposite, qx.lang.String.format("Error creating form window", [ ]));
				qx.log.Logger.error(e.stack);
			}
			finally {
				parser.dispose();
			}
			return null;
		},
		
		openWindow: function(xmlCode, model, resultCallback) {
			var window = new qx.ui.window.Window();
			window.set({ minWidth: 500, modal: true, showMinimize: false, showMaximize: false});
			var grid = new qx.ui.layout.Grid();
			grid.setColumnFlex(0, 1);
	      	grid.setRowFlex(0, 1);
			window.setLayout(grid);
			var formComponent = qookery.impl.QookeryContext.createFormComponent(xmlCode, window, { row: 0, column: 0}, function () {
				window.close();
			});
			window.center();
			window.open();
			formComponent.setModel(model);
			window.addListener("disappear", function() {
				resultCallback(formComponent.getResult());
				window.destroy();
				window = null;
			});
		}
	}
});
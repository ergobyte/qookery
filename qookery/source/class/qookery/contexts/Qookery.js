
qx.Class.define("qookery.contexts.Qookery", {

	type: "static",

	statics: {

		/**
		 * Use resource loader to load a resource
		 *
		 * @param {} resourceUrl the URL of the resource to load
		 * @param {} callback a callback to call on successful loading
		 */
		loadResource: function(resourceUrl, callback) {
			qookery.Qookery.getInstance().getResourceLoader().loadResource(resourceUrl, callback);
		},

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
				qx.log.Logger.error(parentComposite, qx.lang.String.format("Error creating form window: %1", [ e ]));
				if(e.stack) qx.log.Logger.error(e.stack);
			}
			finally {
				parser.dispose();
			}
			return null;
		},

		openWindow: function(formUrl, model, resultCallback, title, icon) {
			icon = icon || null;
			title = title || null;
			qookery.Qookery.getInstance().getResourceLoader().loadResource(formUrl, function(data) {
				var window = new qookery.impl.FormWindow(title, icon);
				window.createAndOpen(data, model);
				window.addListener("disappear", function() {
					if(resultCallback) resultCallback(window.getFormComponent().getResult());
					window = null;
				});
			});
		}
	}
});
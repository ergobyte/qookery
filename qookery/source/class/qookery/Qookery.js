/**
 * Entry class for accessing Qookery features
 */
qx.Class.define("qookery.Qookery", {

	type: "singleton",
	extend: qx.core.Object,

	members: {

		__connectionHandler: null,
		__labelProvider: null,
		
		createNewParser: function() {
			return new qookery.internal.XmlParser();
		},
		
		getConnectionHandler: function() {
			return this.__connectionHandler;
		},

		setConnectionHandler: function(handler) {
			this.__connectionHandler = handler;
		},

		getLabelProvider: function() {
			return this.__labelProvider;
		},

		setLabelProvider: function(provider) {
			this.__labelProvider = provider;
		}
	},
	
	destruct: function() {
		this.__connectionHandler = null;
		this.__labelProvider = null;
	}
});

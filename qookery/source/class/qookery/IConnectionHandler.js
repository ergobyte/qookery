/**
 * Connections permit Qookery users to create data bindings for components
 */
qx.Interface.define("qookery.IConnectionHandler", {

	members: {

		/**
		 * Handle connection specification of a connectable component
		 * 
		 * @param connectionSpecification {String} specification, as provided by the XML document
		 * @param connectableComponent {qookery.IComponent} a component that supports data binding
		 */
		handleConnection: function(connectionSpecification, connectableComponent) { }
	}
});

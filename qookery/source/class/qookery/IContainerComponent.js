/**
 * Interface for components that are containers of other components
 */
qx.Interface.define("qookery.IContainerComponent", {

	extend: qookery.IComponent,
	
	members: {
		
		/**
		 * Add a component as a child of this component
		 * 
		 * @param childComponent {qookery.IComponent} the component to add to this component
		 * 
		 * @throw an exception is thrown in case this component does not support children
		 */
		addChild: function(component) { },
		
		listChildren: function() { }
	}
});

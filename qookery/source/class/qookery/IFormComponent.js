/**
 * Form components implement this interface
 */
qx.Interface.define("qookery.IFormComponent", {

	extend: qookery.IComponent,
	
	events: {

		/**
		 * This event is fired when a Qookery form is about to close.
		 */
		"formClose": "qx.event.type.Event",

		/**
		 * Event for informing listeners that a Qookery form's model has changed
		 */
		"modelChanged": "qx.event.type.Event"
	},

	members: {
		
		/**
		 * Return form identifier, as provided on form creation
		 */
		getId: function() { },

		/**
		 * Validate the form's state
		 *
		 * @return {Boolean} <code>true</code> in case the form's state is valid
		 */
		validate: function() { },

		/**
		 * Get the form's model
		 */
		getModel: function() { },

		/**
		 * Set the form's model
		 */
		setModel: function(model) { },

		/**
		 * Return the form's underlying object controller
		 * 
		 * @return {qx.data.controller.Object} The form's controller
		 */
		getController: function() { }
	}
});

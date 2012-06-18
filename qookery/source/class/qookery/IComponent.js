/**
 * Each and every Qookery user interface component implements this interface
 */
qx.Interface.define("qookery.IComponent", {

	members: {

		/**
		 * @return {qookery.IFormComponent} the form containing this component
		 */
		getForm: function() { },

		/**
		 * @return {qookery.IComponent} parent component or <code>null</code> if none exists
		 */
		getParent: function() { },

		/**
		 * Return the component's main value, if any
		 * 
		 * @return {any} the component's main value
		 */
		getValue: function() { },

		/**
		 * Return a list of widgets that are handled by this component
		 * 
		 * @param filterName {String} If set, one of 'topMost', 'main' to restrict resulting list
		 * 
		 * @return {Array of qx.ui.core.Widget} widget list - an empty array if none found
		 */
		listWidgets: function(filterName) { },

		/**
		 * Add a validation to the component
		 *
		 * @param validationOptions {Object} validation options, see below
		 * 
		 * @argument type One of <code>notNull</code>, <code>regularExpression</code>
		 * @argument message Error message in case validator fails
		 */
		addValidation: function(validationOptions) { }
	}
});


qx.Interface.define("qookery.ILabelProvider", {

	members: {

		/**
		 * Return a human-friendly label for a JavaScript object
		 * 
		 * @param {any} a JavaScript object - it can never be <code>null</code>
		 * 
		 * @return {String} any textual label or <code>null</code> if none available
		 */
		getLabel: function(object) { }
	}
});

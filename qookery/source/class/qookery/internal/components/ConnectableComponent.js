/**
 * Base class for components that support data binding
 */
qx.Class.define("qookery.internal.components.ConnectableComponent", {

	type : "abstract",
	extend: qookery.internal.components.BaseComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	}
});

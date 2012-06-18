
qx.Class.define("qookery.internal.validators.NotNullValidator", {

	extend: qx.core.Object,

	construct : function(message) {
		if(message == null || message.length == 0)
			throw "Validation message is required for not-null validator";
		return function(validator, value) {
			window.setTimeout(function() {
				if (value == null || value.length == 0)
					validator.setValid(false, message);
				 else
					validator.setValid(true);
			}, 100);
		};
	}
});


qx.Class.define("qookery.internal.validators.RegularExpressionValidator", {

	extend: qx.core.Object,

	construct : function (regex, message) {
		if(message == null || message.length == 0)
			throw "Validation message is required for regular expression validator";
		return function(validator, value) {
			window.setTimeout(function() {
				if(regex.test(value) == false)
					validator.setValid(false, message);
				 else 
					validator.setValid(true);
			}, 100);
		};
	}
});

/*
	Qookery - Declarative UI Building for Qooxdoo

	Copyright (c) Ergobyte Informatics S.A., www.ergobyte.gr

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

		http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.

	$Id$
*/

qx.Class.define("qookery.internal.validators.StringValidator", {

	extend: qx.core.Object,
	implement: [ qookery.IValidator ],
	type: "singleton",

	construct: function () {
		this.base(arguments);
	},

	members: {
		createValidatorFunction: function(options) { 
			var regex = options['regularExpression'] || null;
			var minimumLength = (Number(options['minimumLength'])) || 0;
			var maximumLength = (Number(options['maximumLength'])) || 100;
			var message = options['message'];
			if(!message || message.length == 0)
				throw new Error("Validation message is required for string validator");
			return function(value, item) {
				if(!value || value.length < minimumLength || value.length > maximumLength 
				|| (regex != null && (regex.test(value) == false))) {
					item.setInvalidMessage(message);
					return false;
				}
				return true;
			};
		}
	}
});

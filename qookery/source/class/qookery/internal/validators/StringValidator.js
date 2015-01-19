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
*/

qx.Class.define("qookery.internal.validators.StringValidator", {

	extend: qx.core.Object,
	implement: [ qookery.IValidator ],
	type: "singleton",

	construct: function () {
		this.base(arguments);
	},

	members: {
		createValidatorFunction: function(component, invalidMessage, options) {
			return function(value) {
				if(!value) return null;
				var success = true;
				if(success && options["regularExpression"])
					success = options["regularExpression"].test(value);
				if(success && options["minimumLength"])
					success = value.length >= parseInt(options["minimumLength"], 10);
				if(success && options["maximumLength"])
					success = value.length <= parseInt(options["maximumLength"], 10);
				if(success) return null;
				return new qookery.util.ValidationError(component, invalidMessage || "String is invalid", null);
			};
		}
	}
});

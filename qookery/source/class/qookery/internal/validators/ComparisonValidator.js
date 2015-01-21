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

qx.Class.define("qookery.internal.validators.ComparisonValidator", {

	extend: qx.core.Object,
	implement: [ qookery.IValidator ],
	type: "singleton",

	construct : function() {
		this.base(arguments);
	},

	members: {
		createValidatorFunction: function(component, invalidMessage, options) {
			var operator = options["operator"] || "eq";
			var expectedValue = options["value"];
			return function(value) {
				if(value === null) return null;
				switch(operator) {
				case "eq":
					if(value == expectedValue) return null;
					if(!invalidMessage) invalidMessage = qx.locale.Manager.tr("qookery.internal.validators.ComparisonValidator.eq", expectedValue);
					break;
				case "ne":
					if(value != expectedValue) return null;
					if(!invalidMessage) invalidMessage = qx.locale.Manager.tr("qookery.internal.validators.ComparisonValidator.ne", expectedValue);
					break;
				case "gt":
					if(value > expectedValue) return null;
					if(!invalidMessage) invalidMessage = qx.locale.Manager.tr("qookery.internal.validators.ComparisonValidator.gt", expectedValue);
					break;
				case "ge":
					if(value >= expectedValue) return null;
					if(!invalidMessage) invalidMessage = qx.locale.Manager.tr("qookery.internal.validators.ComparisonValidator.ge", expectedValue);
					break;
				case "le":
					if(value <= expectedValue) return null;
					if(!invalidMessage) invalidMessage = qx.locale.Manager.tr("qookery.internal.validators.ComparisonValidator.le", expectedValue);
					break;
				case "lt":
					if(value < expectedValue) return null;
					if(!invalidMessage) invalidMessage = qx.locale.Manager.tr("qookery.internal.validators.ComparisonValidator.lt", expectedValue);
					break;
				}
				return new qookery.util.ValidationError(component, invalidMessage, null);
			};
		}
	}
});

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

qx.Class.define("qookery.impl.DefaultModelProvider", {

	extend: qx.core.Object,
	implement: [ qookery.IModelProvider ],
	type: "singleton",
	
	construct: function() {
		this.base(arguments);
	},
	
	members: {

		getIdentity: function(object) {
			return object.toString();
		},
		
		getLabel: function(object) {
			return object;
		},

		handleConnection: function(component, namespaceUri, propertyPath) {
			var formController = component.getForm().getController();
			component.connect(formController, propertyPath, true);
		}
	}
	
});

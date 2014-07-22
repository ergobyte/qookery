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

qx.Class.define("qookery.impl.DefaultModelProvider", {

	extend: qx.core.Object,
	implement: [ qookery.IModelProvider ],

	members: {

		identityOf: function(object) {
			return object != null ? object.toString() : null;
		},

		areEqual: function(object1, object2) {
			var id1 = this.identityOf(object1);
			var id2 = this.identityOf(object2);
			if(qx.lang.Type.isArray(id1) && qx.lang.Type.isArray(id2))
				return qx.lang.Array.equals(id1, id2);
			return id1 == id2;
		},

		getLabel: function(object) {
			return object;
		},

		handleConnection: function(formParser, component, connectionSpecification) {
			component.connect(component.getForm(), connectionSpecification);
			return null;
		},

		getConnectionAttribute: function(connectionHandle, attributeName) {
			// The default model provider does not provide any attributes
			return;
		},

		clone: function(object) {
			return object; // Not supported by this model provider
		}
	}
});

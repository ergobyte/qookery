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

	type: "singleton",
	extend: qx.core.Object,
	implement: [ qookery.IModelProvider ],

	members: {

		identityOf: function(object) {
			return object != null ? object.toString() : null;
		},

		areEqual: function(object1, object2) {
			if(object1 instanceof Date && object2 instanceof Date)
				return object1.getTime() === object2.getTime();
			var id1 = this.identityOf(object1), id2 = this.identityOf(object2);
			if(id1 !== undefined && id2 !== undefined) {
				if(qx.lang.Type.isArray(id1) && qx.lang.Type.isArray(id2))
					return qx.lang.Object.equals(id1, id2);
				return id1 == id2;
			}
			return object1 === object2;
		},

		compare: function(object1, object2) {
			if(object1 === object2) return 0;
			if(object1 == null) return -1;
			if(object2 == null) return 1;
			var type1 = typeof object1;
			var type2 = typeof object2;
			if(type1 !== type2)
				throw new Error("Unable to compare objects of different type");
			if(type1 === "string")
				return object1 == object2 ? 0 : object1 > object2 ? 1 : -1;
			if(type1 === "number")
				return object1 - object2;
			if(type1 === "boolean")
				return object1 ? 1 : -1;
			if(object1 instanceof Date && object2 instanceof Date)
				return object1.getTime() - object2.getTime();
			throw new Error("Unsupported object types for comparison");
		},

		convertFrom: function(value, className) {
			// No conversion performed by default
			return value;
		},

		convertTo: function(object, className) {
			// No conversion performed by default
			return object;
		},

		getLabel: function(object, labelType) {
			if(qx.lang.Type.isString(object)) return object;
			return qx.data.Conversion.toString(object);
		},

		connectComponent: function(component, connectionSpecification) {
			// The default model provider expects a Qooxdoo property path in the specification argument
			return component.getForm().addConnection(component, connectionSpecification);
		},

		clone: function(object) {
			return object; // Not supported by this model provider
		}
	}
});

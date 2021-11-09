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

qx.Class.define("qookery.internal.util.Connection", {

	extend: Object,

	construct: function(editableComponent, propertyPath) {
		this.__editableComponent = editableComponent;
		this.__propertyPath = propertyPath;
	},

	members: {

		__editableComponent: null,
		__propertyPath: null,
		__disconnectCallback: null,

		connect: function(model) {
			this.disconnect();
			if(qx.core.ObjectRegistry.inShutDown)
				return;
			var editableComponent = this.__editableComponent;
			if(model == null || editableComponent == null)
				return;
			try {
				var bindingId = model.bind(this.__propertyPath, editableComponent, "value");
				this.__disconnectCallback = function() {
					if(model.isDisposed())
						return;
					qx.data.SingleValueBinding.removeBindingFromObject(model, bindingId);
				};
			}
			catch(e) {
				// Creation of binding failed, probably due to the lack of appropriate event in the model
				// We resort to simply setting the editor's value, without reacting to model changes
				editableComponent.setValue(this.getModelValue(model));
			}
		},

		getModelValue: function(model) {
			var segments = this.__propertyPath.split(".");
			for(var i = 0; i < segments.length; i++) {
				model = model["get" + qx.lang.String.firstUp(segments[i])]();
				if(model == null)
					return null;
			}
			return model;
		},

		setModelValue: function(model, value) {
			var segments = this.__propertyPath.split(".");
			for(var i = 0; i < segments.length - 1; i++) {
				model = model["get" + qx.lang.String.firstUp(segments[i])]();
				if(model == null)
					return;
			}
			model["set" + qx.lang.String.firstUp(segments[segments.length - 1])](value);
		},

		/**
		 * Return the value of a connection's attribute, if available
		 *
		 * @param attributeName {String} name of wanted attribute
		 * @param defaultValue {any} an optional default value
		 *
		 * @return {any} attribute value or second argument if <code>undefined</code>
		 */
		getAttribute: function(attributeName, defaultValue) {
			return defaultValue;
		},

		disconnect: function() {
			if(this.__disconnectCallback == null) return;
			this.__disconnectCallback();
			this.__disconnectCallback = null;
		},

		equals: function(other) {
			return other.__editableComponent === this.__editableComponent &&
					other.__propertyPath == this.__propertyPath;
		}
	}
});

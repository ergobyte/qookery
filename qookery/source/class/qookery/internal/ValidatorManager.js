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

/**
 * ValidatorManager is responsible for validation of editable components in forms
 */
qx.Class.define("qookery.internal.ValidatorManager", {

	extend : qx.core.Object,
	
	construct : function() {
		this.base(arguments);
		this.__validations = [];
	},

	properties: {
		"valid": { check: "Boolean", init: true, nullable: false, event: "changeValid" }
	},
	
	members: {
	
		__validations: null,

		/**
		 * Add a validation to the list of validations performed by this manager
		 *
		 * The validator can either returns a boolean or fire an
		 * {@link qx.core.ValidationError}. 
		 *
		 * @param component {qookery.IEditableComponent} editable component to check against
		 * @param validator {Function} validator to add
		 */
		add: function(component, validator) {
			if(!validator) return;
			if(!qx.Class.hasInterface(component.constructor, qookery.IEditableComponent))
				throw new Error("Added component must be editable");
			var validation = { component: component, validator: validator };
			this.__validations.push(validation);
		},
	
		/**
		 * Remove a component's validations from the validator manager.
		 *
		 * @param component {qookery.IEditableComponent} The component to use when looking for validations
		 * 
		 * @return {qookery.IEditableComponent?null} The removed form component or
		 *  <code>null</code> if the component could not be found.
		 */
		remove: function(component) {
			var componentPositions = [];
			for(var i = 0; i < this.__validations.length; i++) {
				if(component === this.__validations[i].component)
					componentPositions.push(i);
			}
			for(var i = 0; i < componentPositions.length; i++)
				this.__validations.splice(componentPositions[i], 1);
			if(componentPositions.length > 0) return component;
			return null;
		},
	
		/**
		 * Invokes the validation
		 * 
		 * The result of the validation can then be accessed with the
		 * {@link #getValid} method.
		 *
		 * @return {Boolean|undefined} The validation result, if available.
		 */
		validate: function() {
			var valid = true;
			for(var i = 0; i < this.__validations.length; i++) {
				var validation = this.__validations[i];
				var result = this.__performValidation(validation);
				valid = result && valid;
			}
			this.setValid(valid);
			return valid;
		},
	
		__performValidation: function(validation) {
			var component = validation.component;
			var validator = validation.validator;
			var result = null;
			try {
				var value = component.getValue();
				result = validator.call(this, value, component);
				if(result === undefined) result = true;
			}
			catch(e) {
				if(e instanceof qx.core.ValidationError) {
					result = false;
					var invalidMessage = null;
					if(e.message && e.message != qx.type.BaseError.DEFAULTMESSAGE)
						invalidMessage = e.message;
					else
						invalidMessage = e.getComment();
					component.setInvalidMessage(invalidMessage);
				}
				else throw e;
			}
			component.setValid(result);
			return result;
		},
		
		/**
		 * Resets the validator.
		 */
		reset: function() {
			for(var i = 0; i < this.__validations.length; i++) {
				var validation = this.__validations[i];
				validation.component.setValid(true);
			}
			this.setValid(true);
		}
	},
	
	destruct: function() {
		this.__validations = null;
	}
});

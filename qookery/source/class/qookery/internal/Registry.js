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

qx.Class.define("qookery.internal.Registry", {
	
	extend: qx.core.Object,
	type: "singleton",
	implement: [ qookery.IRegistry ],
	
	construct: function() {
		this.base(arguments);
		this.__initializeValidators();
		this.__initializeComponents();
	},
	
	members: {
		
		__validators: { },
		__components: { },
		
		registerValidator: function(validator, name) { 
			this.__validators[name] = validator.getInstance();
		},
		
		getValidator: function(validator) {
			return this.__validators[validator];
		},
		
		registerComponent: function(component, name) { 
			this.__components[name] = component;
		},
		
		getComponent: function(component) { 
			return this.__components[component];
		},
		
		__initializeValidators: function() {
			this.__validators["notNull"] = qookery.internal.validators.NotNullValidator.getInstance();
			this.__validators["regularExpression"] = qookery.internal.validators.RegularExpressionValidator.getInstance();
		},
		
		__initializeComponents: function() {
			this.__components["button"] = qookery.internal.components.ButtonComponent;
			this.__components["check-box"] = qookery.internal.components.CheckBoxComponent;
			this.__components["composite"] = qookery.internal.components.CompositeComponent;
			this.__components["date-field"] = qookery.internal.components.DateChooserComponent;
			this.__components["form"] = qookery.internal.components.FormComponent;
			this.__components["group-box"] = qookery.internal.components.GroupComponent;
			this.__components["image"] = qookery.internal.components.ImageComponent;
			this.__components["label"] = qookery.internal.components.LabelComponent;
			this.__components["list"] = qookery.internal.components.ListComponent;
			this.__components["password-field"] = qookery.internal.components.PasswordComponent;
			this.__components["radio-group"] = qookery.internal.components.RadioComponent;
			this.__components["select-box"] = qookery.internal.components.SelectBoxComponent;
			this.__components["separator"] = qookery.internal.components.SeparatorComponent;
			this.__components["slider"] = qookery.internal.components.SliderComponent;
			this.__components["spinner"] = qookery.internal.components.SpinnerComponent;
			this.__components["tab-view"] = qookery.internal.components.TabHolderComponent;
			this.__components["tab-view-page"] = qookery.internal.components.TabPageComponent;
			this.__components["table"] = qookery.internal.components.TableComponent;
			this.__components["text-area"] = qookery.internal.components.TextAreaComponent;
			this.__components["text-field"] = qookery.internal.components.TextComponent;
		}
	},
	
	destruct: function() {
		this.__validators = null;
		this.__components = null;
	}
});

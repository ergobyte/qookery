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

		this.__validators = { };
		this.__validators["notNull"] = qookery.internal.validators.NotNullValidator.getInstance();
		this.__validators["string"] = qookery.internal.validators.StringValidator.getInstance();

		this.__components = { };
		this.__components["button"] = qookery.internal.components.ButtonComponent;
		this.__components["check-box"] = qookery.internal.components.CheckBoxComponent;
		this.__components["composite"] = qookery.internal.components.CompositeComponent;
		this.__components["date-field"] = qookery.internal.components.DateFieldComponent;
		this.__components["form"] = qookery.internal.components.FormComponent;
		this.__components["group-box"] = qookery.internal.components.GroupBoxComponent;
		this.__components["html"] = qookery.internal.components.HtmlComponent;
		this.__components["image"] = qookery.internal.components.ImageComponent;
		this.__components["label"] = qookery.internal.components.LabelComponent;
		this.__components["list"] = qookery.internal.components.ListComponent;
		this.__components["password-field"] = qookery.internal.components.PasswordFieldComponent;
		this.__components["radio-button"] = qookery.internal.components.RadioButtonComponent;
		this.__components["radio-button-group"] = qookery.internal.components.RadioButtonGroupComponent;
		this.__components["scroll"] = qookery.internal.components.ScrollComponent;
		this.__components["select-box"] = qookery.internal.components.SelectBoxComponent;
		this.__components["separator"] = qookery.internal.components.SeparatorComponent;
		this.__components["slider"] = qookery.internal.components.SliderComponent;
		this.__components["spacer"] = qookery.internal.components.SpacerComponent;
		this.__components["spinner"] = qookery.internal.components.SpinnerComponent;
		this.__components["stack"] = qookery.internal.components.StackComponent;
		this.__components["tab-view"] = qookery.internal.components.TabHolderComponent;
		this.__components["tab-view-page"] = qookery.internal.components.TabPageComponent;
		this.__components["table"] = qookery.internal.components.TableComponent;
		this.__components["text-area"] = qookery.internal.components.TextAreaComponent;
		this.__components["text-field"] = qookery.internal.components.TextFieldComponent;
		this.__components["tool-bar"] = qookery.internal.components.ToolBarComponent;

		this.__componentConstructorArgs = { };

		this.__formats = { };
		this.__formats["custom"] = qookery.internal.formats.CustomFormat;
		this.__formats["date"] = qookery.internal.formats.DateFormat;
		this.__formats["map"] = qookery.internal.formats.MapFormat;
		this.__formats["number"] = qookery.internal.formats.NumberFormat;

		this.__maps = { };
	},

	members: {

		__validators: null,
		__components: null,
		__componentConstructorArgs: null,
		__formats: null,
		__maps: null,

		// Components

		isComponentTypeAvailable: function(typeName) {
			return this.__components[typeName] !== undefined;
		},

		registerComponentType: function(typeName, componentClass, constructorArg) {
			this.__components[typeName] = componentClass;
			if(constructorArg)
				this.__componentConstructorArgs[typeName] = constructorArg;
		},

		createComponent: function(typeName, parentComponent) {
			var componentClass = this.__components[typeName];
			if(!componentClass)
				throw new Error(qx.lang.String.format("Unknown component type '%1'", [ typeName ]));
			var constructorArg = this.__componentConstructorArgs[typeName];
			return new componentClass(parentComponent, constructorArg);
		},

		// Validators

		registerValidator: function(validator, name) {
			this.__validators[name] = validator.getInstance();
		},

		getValidator: function(validator) {
			return this.__validators[validator];
		},

		// Formats

		registerFormatClass: function(formatName, formatClass) {
			this.__formats[formatName] = formatClass;
		},

		createFormat: function(formatName, options) {
			var formatClass = this.__formats[formatName];
			if(!formatClass)
				throw new Error(qx.lang.String.format("Unknown format '%1'", [ formatName ]));
			return new formatClass(options);
		},
		
		createFormatSpecification: function(formatSpecification) { 
			var formatName = formatSpecification;
			var options = {};
			var colonCharacterPos = formatSpecification.indexOf(":");
			if(colonCharacterPos != -1) {
				formatName = formatSpecification.slice(0, colonCharacterPos);
				var optionsStr = formatSpecification.slice(colonCharacterPos + 1);
				if(optionsStr) optionsStr.replace(/([^=,]+)=([^,]*)/g, function(m, key, value) {
					key = qx.lang.String.clean(key);
					value = qx.lang.String.clean(value);
					options[key] = value;
				});
			}
			return this.createFormat(formatName, options);
		},

		// Maps

		registerMap: function(mapName, map) {
			this.__maps[mapName] = map;
		},

		getMap: function(mapName) {
			return this.__maps[mapName];
		}
	},

	destruct: function() {
		this.__validators = null;
		this.__components = null;
		this.__formats = null;
	}
});

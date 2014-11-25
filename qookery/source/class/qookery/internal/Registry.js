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

qx.Class.define("qookery.internal.Registry", {

	extend: qx.core.Object,
	type: "singleton",
	implement: [ qookery.IRegistry ],

	construct: function() {
		this.base(arguments);

		this.__modelProviders = { };
		this.__modelProviders["default"] = new qookery.impl.DefaultModelProvider();
		this.__defaultModelProvider = this.__modelProviders["default"];

		this.__validators = { };
		this.__validators["notNull"] = qookery.internal.validators.NotNullValidator.getInstance();
		this.__validators["string"] = qookery.internal.validators.StringValidator.getInstance();

		this.__components = { };
		this.__components["{http://www.qookery.org/ns/Form}button"] = qookery.internal.components.ButtonComponent;
		this.__components["{http://www.qookery.org/ns/Form}check-field"] = qookery.internal.components.CheckFieldComponent;
		this.__components["{http://www.qookery.org/ns/Form}composite"] = qookery.internal.components.CompositeComponent;
		this.__components["{http://www.qookery.org/ns/Form}date-field"] = qookery.internal.components.DateFieldComponent;
		this.__components["{http://www.qookery.org/ns/Form}form"] = qookery.internal.components.FormComponent;
		this.__components["{http://www.qookery.org/ns/Form}group-box"] = qookery.internal.components.GroupBoxComponent;
		this.__components["{http://www.qookery.org/ns/Form}hover-button"] = qookery.internal.components.HoverButtonComponent;
		this.__components["{http://www.qookery.org/ns/Form}html"] = qookery.internal.components.HtmlComponent;
		this.__components["{http://www.qookery.org/ns/Form}iframe"] = qookery.internal.components.IframeComponent;
		this.__components["{http://www.qookery.org/ns/Form}image"] = qookery.internal.components.ImageComponent;
		this.__components["{http://www.qookery.org/ns/Form}label"] = qookery.internal.components.LabelComponent;
		this.__components["{http://www.qookery.org/ns/Form}list"] = qookery.internal.components.ListComponent;
		this.__components["{http://www.qookery.org/ns/Form}password-field"] = qookery.internal.components.PasswordFieldComponent;
		this.__components["{http://www.qookery.org/ns/Form}progress-bar"] = qookery.internal.components.ProgressBarComponent;
		this.__components["{http://www.qookery.org/ns/Form}radio-button"] = qookery.internal.components.RadioButtonComponent;
		this.__components["{http://www.qookery.org/ns/Form}radio-button-group"] = qookery.internal.components.RadioButtonGroupComponent;
		this.__components["{http://www.qookery.org/ns/Form}scroll"] = qookery.internal.components.ScrollComponent;
		this.__components["{http://www.qookery.org/ns/Form}select-box"] = qookery.internal.components.SelectBoxComponent;
		this.__components["{http://www.qookery.org/ns/Form}separator"] = qookery.internal.components.SeparatorComponent;
		this.__components["{http://www.qookery.org/ns/Form}slider"] = qookery.internal.components.SliderComponent;
		this.__components["{http://www.qookery.org/ns/Form}spacer"] = qookery.internal.components.SpacerComponent;
		this.__components["{http://www.qookery.org/ns/Form}spinner"] = qookery.internal.components.SpinnerComponent;
		this.__components["{http://www.qookery.org/ns/Form}split-pane"] = qookery.internal.components.SplitPaneComponent;
		this.__components["{http://www.qookery.org/ns/Form}stack"] = qookery.internal.components.StackComponent;
		this.__components["{http://www.qookery.org/ns/Form}tab-view"] = qookery.internal.components.TabViewComponent;
		this.__components["{http://www.qookery.org/ns/Form}tab-view-page"] = qookery.internal.components.TabViewPageComponent;
		this.__components["{http://www.qookery.org/ns/Form}table"] = qookery.internal.components.TableComponent;
		this.__components["{http://www.qookery.org/ns/Form}text-area"] = qookery.internal.components.TextAreaComponent;
		this.__components["{http://www.qookery.org/ns/Form}text-field"] = qookery.internal.components.TextFieldComponent;
		this.__components["{http://www.qookery.org/ns/Form}toggle-button"] = qookery.internal.components.ToggleButtonComponent;
		this.__components["{http://www.qookery.org/ns/Form}tool-bar"] = qookery.internal.components.ToolBarComponent;
		this.__components["{http://www.qookery.org/ns/Form}virtual-tree"] = qookery.internal.components.VirtualTreeComponent;

		this.__componentConstructorArgs = { };

		this.__formats = { };
		this.__formats["custom"] = qookery.internal.formats.CustomFormat;
		this.__formats["date"] = qookery.internal.formats.DateFormat;
		this.__formats["map"] = qookery.internal.formats.MapFormat;
		this.__formats["number"] = qookery.internal.formats.NumberFormat;

		this.__maps = { };
		this.__libraries = { };
	},

	members: {

		__modelProviders: null,
		__resourceLoader: null,
		__defaultModelProvider: null,
		__validators: null,
		__components: null,
		__componentConstructorArgs: null,
		__formats: null,
		__maps: null,
		__libraries: null,

		// Model providers

		getModelProvider: function(providerName) {
			if(!providerName) return this.__defaultModelProvider;
			var provider = this.__modelProviders[providerName];
			if(!provider)
				throw new Error(qx.lang.String.format("Unknown model provider '%1' requested", [ providerName ]));
			return provider;
		},

		registerModelProvider: function(providerName, provider, setDefault) {
			this.__modelProviders[providerName] = provider;
			if(setDefault) this.__defaultModelProvider = provider;
		},

		// Resource loader

		getResourceLoader: function() {
			if(!this.__resourceLoader)
				this.__resourceLoader = new qookery.impl.DefaultResourceLoader();
			return this.__resourceLoader;
		},

		setResourceLoader: function(loader) {
			this._disposeObjects("__resourceLoader");
			this.__resourceLoader = loader;
		},

		// Components

		isComponentTypeAvailable: function(componentQName) {
			var componentClass = this.__components[componentQName];
			return componentClass !== undefined;
		},

		registerComponentType: function(componentQName, componentClass, constructorArg) {
			this.__components[componentQName] = componentClass;
			if(constructorArg)
				this.__componentConstructorArgs[componentQName] = constructorArg;
		},

		createComponent: function(componentQName, parentComponent) {
			var componentClass = this.__components[componentQName];
			if(!componentClass)
				throw new Error(qx.lang.String.format("Unknown component '%1'", [ componentQName ]));
			var constructorArg = this.__componentConstructorArgs[componentQName];
			return new componentClass(parentComponent, constructorArg);
		},

		// Validators

		registerValidator: function(name, validator) {
			this.__validators[name] = validator;
		},

		getValidator: function(name) {
			return this.__validators[name];
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
		},

		// Libraries

		registerLibrary: function(libraryName, resourceUris, dependencies, postLoadCallback) {
			if(this.__libraries[libraryName]) return; // Prevent redefinition
			this.__libraries[libraryName] = new qookery.internal.util.Library(libraryName, resourceUris, dependencies, postLoadCallback);
		},

		loadLibrary: function(libraryName, callback, thisArg) {
			var library = this.__libraries[libraryName];
			if(!library) throw new Error("Unable to load unknown library " + libraryName);
			library.load(callback, thisArg);
		}
	},

	destruct: function() {
		this._disposeArray("__modelProviders");
		this.__validators = null;
		this.__components = null;
		this.__formats = null;
	}
});

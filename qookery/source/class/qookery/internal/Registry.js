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
		this.__partitions = { };
		var partition = this.__attributes = this.__createPartition(qookery.IRegistry.P_ATTRIBUTE);
		partition["allow-grow"] = "Boolean";
		partition["allow-grow-x"] = "Boolean";
		partition["allow-grow-y"] = "Boolean";
		partition["allow-shrink"] = "Boolean";
		partition["allow-shrink-x"] = "Boolean";
		partition["allow-shrink-y"] = "Boolean";
		partition["allow-stretch"] = "Boolean";
		partition["allow-stretch-x"] = "Boolean";
		partition["allow-stretch-y"] = "Boolean";
		partition["col-span"] = "Number";
		partition["column"] = "Number";
		partition["enabled"] = "Boolean";
		partition["flex"] = "Number";
		partition["focusable"] = "Boolean";
		partition["height"] = "Size";
		partition["label"] = "ReplaceableString";
		partition["left"] = "Number";
		partition["line-break"] = "Boolean";
		partition["live-update"] = "Boolean";
		partition["margin"] = "IntegerList";
		partition["margin-bottom"] = "Integer";
		partition["margin-left"] = "Integer";
		partition["margin-right"] = "Integer";
		partition["margin-top"] = "Integer";
		partition["max-height"] = "Size";
		partition["max-length"] = "Integer";
		partition["max-width"] = "Size";
		partition["maximum"] = "Integer";
		partition["min-height"] = "Size";
		partition["min-width"] = "Size";
		partition["minimal-line-height"] = "Integer";
		partition["minimum"] = "Integer";
		partition["native-context-menu"] = "Boolean";
		partition["padding"] = "IntegerList";
		partition["padding-bottom"] = "Integer";
		partition["padding-left"] = "Integer";
		partition["padding-right"] = "Integer";
		partition["padding-top"] = "Integer";
		partition["page-step"] = "Integer";
		partition["read-only"] = "Boolean";
		partition["required"] = "Boolean";
		partition["reversed"] = "Boolean";
		partition["row"] = "Number";
		partition["row-height"] = "Integer";
		partition["row-span"] = "Number";
		partition["single-step"] = "Integer";
		partition["spacing"] = "Integer";
		partition["spacing-x"] = "Integer";
		partition["spacing-y"] = "Integer";
		partition["stretch"] = "Boolean";
		partition["tab-index"] = "Integer";
		partition["tool-tip-text"] = "ReplaceableString";
		partition["top"] = "Number";
		partition["width"] = "Size";

		partition = this.__createPartition(qookery.IRegistry.P_SERVICE);
		partition["qookery.IModelProvider"] = qookery.impl.DefaultModelProvider;
		partition["qookery.IRegistry"] = this;
		partition["qookery.IResourceLoader"] = qookery.impl.DefaultResourceLoader;
		partition["qx.application.IApplication"] = { getInstance: function() {
			return qx.core.Init.getApplication();
		} };

		// Obsolete shorthands, refrain from using; full interface name is preferred
		partition["Application"] = partition["qx.application.IApplication"];
		partition["ModelProvider"] = partition["qookery.IModelProvider"];
		partition["Registry"] = partition["qookery.IRegistry"];
		partition["ResourceLoader"] = partition["qookery.IResourceLoader"];

		partition = this.__createPartition(qookery.IRegistry.P_MEDIA_QUERY);
		partition["small-up"] = "only screen";
		partition["small-only"] = "only screen and (max-width: 40em)"; // Mobile screens, width up to 640px
		partition["medium-up"] = "only screen and (min-width: 40.063em)";
		partition["medium-only"] = "only screen and (min-width: 40.063em) and (max-width: 64em)"; // Tablet screens, width up to 1024px
		partition["large-up"] = "only screen and (min-width: 64.063em)";
		partition["large-only"] = "only screen and (min-width: 64.063em) and (max-width: 90em)"; // Large screens, width up to1440px
		partition["xlarge-up"] = "only screen and (min-width: 90.063em)";
		partition["xlarge-only"] = "only screen and (min-width: 90.063em) and (max-width: 120em)"; // Extra large screens, width up to 1920px
		partition["xxlarge-up"] = "only screen and (min-width: 120.063em)";

		partition = this.__createPartition(qookery.IRegistry.P_MODEL_PROVIDER);
		partition["default"] = qookery.impl.DefaultModelProvider.getInstance();

		partition = this.__createPartition(qookery.IRegistry.P_VALIDATOR);
		partition["array"] = qookery.internal.validators.ArrayValidator.getInstance();
		partition["comparison"] = qookery.internal.validators.ComparisonValidator.getInstance();
		partition["notNull"] = qookery.internal.validators.NotNullValidator.getInstance();
		partition["string"] = qookery.internal.validators.StringValidator.getInstance();

		partition = this.__createPartition(qookery.IRegistry.P_LAYOUT_FACTORY);
		partition["{http://www.qookery.org/ns/Form}basic"] = qookery.internal.layouts.BasicLayoutFactory.getInstance();
		partition["{http://www.qookery.org/ns/Form}flow"] = qookery.internal.layouts.FlowLayoutFactory.getInstance();
		partition["{http://www.qookery.org/ns/Form}grid"] = qookery.internal.layouts.GridLayoutFactory.getInstance();
		partition["{http://www.qookery.org/ns/Form}grow"] = qookery.internal.layouts.GrowLayoutFactory.getInstance();
		partition["{http://www.qookery.org/ns/Form}h-box"] = qookery.internal.layouts.HBoxLayoutFactory.getInstance();
		partition["{http://www.qookery.org/ns/Form}v-box"] = qookery.internal.layouts.VBoxLayoutFactory.getInstance();

		partition = this.__createPartition(qookery.IRegistry.P_COMPONENT);
		partition["{http://www.qookery.org/ns/Form}button"] = qookery.internal.components.ButtonComponent;
		partition["{http://www.qookery.org/ns/Form}canvas"] = qookery.internal.components.CanvasComponent;
		partition["{http://www.qookery.org/ns/Form}check-field"] = qookery.internal.components.CheckFieldComponent;
		partition["{http://www.qookery.org/ns/Form}composite"] = qookery.internal.components.CompositeComponent;
		partition["{http://www.qookery.org/ns/Form}date-field"] = qookery.internal.components.DateFieldComponent;
		partition["{http://www.qookery.org/ns/Form}form"] = qookery.internal.components.FormComponent;
		partition["{http://www.qookery.org/ns/Form}group-box"] = qookery.internal.components.GroupBoxComponent;
		partition["{http://www.qookery.org/ns/Form}hover-button"] = qookery.internal.components.HoverButtonComponent;
		partition["{http://www.qookery.org/ns/Form}html"] = qookery.internal.components.HtmlComponent;
		partition["{http://www.qookery.org/ns/Form}iframe"] = qookery.internal.components.IframeComponent;
		partition["{http://www.qookery.org/ns/Form}image"] = qookery.internal.components.ImageComponent;
		partition["{http://www.qookery.org/ns/Form}label"] = qookery.internal.components.LabelComponent;
		partition["{http://www.qookery.org/ns/Form}list"] = qookery.internal.components.ListComponent;
		partition["{http://www.qookery.org/ns/Form}password-field"] = qookery.internal.components.PasswordFieldComponent;
		partition["{http://www.qookery.org/ns/Form}progress-bar"] = qookery.internal.components.ProgressBarComponent;
		partition["{http://www.qookery.org/ns/Form}radio-button"] = qookery.internal.components.RadioButtonComponent;
		partition["{http://www.qookery.org/ns/Form}radio-button-group"] = qookery.internal.components.RadioButtonGroupComponent;
		partition["{http://www.qookery.org/ns/Form}scroll"] = qookery.internal.components.ScrollComponent;
		partition["{http://www.qookery.org/ns/Form}select-box"] = qookery.internal.components.SelectBoxComponent;
		partition["{http://www.qookery.org/ns/Form}separator"] = qookery.internal.components.SeparatorComponent;
		partition["{http://www.qookery.org/ns/Form}slider"] = qookery.internal.components.SliderComponent;
		partition["{http://www.qookery.org/ns/Form}spacer"] = qookery.internal.components.SpacerComponent;
		partition["{http://www.qookery.org/ns/Form}spinner"] = qookery.internal.components.SpinnerComponent;
		partition["{http://www.qookery.org/ns/Form}split-pane"] = qookery.internal.components.SplitPaneComponent;
		partition["{http://www.qookery.org/ns/Form}stack"] = qookery.internal.components.StackComponent;
		partition["{http://www.qookery.org/ns/Form}tab-view"] = qookery.internal.components.TabViewComponent;
		partition["{http://www.qookery.org/ns/Form}tab-view-page"] = qookery.internal.components.TabViewPageComponent;
		partition["{http://www.qookery.org/ns/Form}table"] = qookery.internal.components.TableComponent;
		partition["{http://www.qookery.org/ns/Form}text-area"] = qookery.internal.components.TextAreaComponent;
		partition["{http://www.qookery.org/ns/Form}text-field"] = qookery.internal.components.TextFieldComponent;
		partition["{http://www.qookery.org/ns/Form}toggle-button"] = qookery.internal.components.ToggleButtonComponent;
		partition["{http://www.qookery.org/ns/Form}tool-bar"] = qookery.internal.components.ToolBarComponent;
		partition["{http://www.qookery.org/ns/Form}virtual-tree"] = qookery.internal.components.VirtualTreeComponent;

		partition = this.__createPartition(qookery.IRegistry.P_FORMAT_FACTORY);
		partition["custom"] = qookery.internal.formats.CustomFormat;
		partition["date"] = qookery.internal.formats.DateFormat;
		partition["map"] = qookery.internal.formats.MapFormat;
		partition["number"] = qookery.internal.formats.NumberFormat;

		partition = this.__createPartition(qookery.IRegistry.P_CELL_EDITOR_FACTORY);
		partition["{http://www.qookery.org/ns/Form}check-box"] = function(component, column) {
			return new qx.ui.table.celleditor.CheckBox();
		};
		partition["{http://www.qookery.org/ns/Form}password-field"] = function(component, column) {
			return new qx.ui.table.celleditor.PasswordField();
		};
		partition["{http://www.qookery.org/ns/Form}select-box"] = function(component, column) {
			return new qx.ui.table.celleditor.SelectBox();
		};
		partition["{http://www.qookery.org/ns/Form}text-field"] = function(component, column) {
			return new qx.ui.table.celleditor.TextField();
		};

		partition = this.__createPartition(qookery.IRegistry.P_CELL_RENDERER_FACTORY);
		partition["{http://www.qookery.org/ns/Form}boolean"] = function(component, column) {
			return new qx.ui.table.cellrenderer.Boolean();
		};
		partition["{http://www.qookery.org/ns/Form}date"] = function(component, column) {
			return new qx.ui.table.cellrenderer.Date(column["text-align"], column["color"], column["font-style"], column["font-weight"]);
		};
		partition["{http://www.qookery.org/ns/Form}debug"] = function(component, column) {
			return new qx.ui.table.cellrenderer.Debug();
		};
		partition["{http://www.qookery.org/ns/Form}default"] = function(component, column) {
			return new qx.ui.table.cellrenderer.Default();
		};
		partition["{http://www.qookery.org/ns/Form}html"] = function(component, column) {
			return new qx.ui.table.cellrenderer.Html(column["text-align"], column["color"], column["font-style"], column["font-weight"]);
		};
		partition["{http://www.qookery.org/ns/Form}image"] = function(component, column) {
			return new qx.ui.table.cellrenderer.Image(column["width"], column["height"]);
		};
		partition["{http://www.qookery.org/ns/Form}model"] = function(component, column) {
			return new qookery.internal.components.table.CellRenderer(component, column);
		};
		partition["{http://www.qookery.org/ns/Form}number"] = function(component, column) {
			return new qx.ui.table.cellrenderer.Number(column["text-align"], column["color"], column["font-style"], column["font-weight"]);
		};
		partition["{http://www.qookery.org/ns/Form}password"] = function(component, column) {
			return new qx.ui.table.cellrenderer.Password();
		};
		partition["{http://www.qookery.org/ns/Form}string"] = function(component, column) {
			return new qx.ui.table.cellrenderer.String(column["text-align"], column["color"], column["font-style"], column["font-weight"]);
		};

		this.__createPartition(qookery.IRegistry.P_COMMAND);
		this.__createPartition(qookery.IRegistry.P_FORMAT);
		this.__createPartition(qookery.IRegistry.P_LIBRARY);
		this.__createPartition(qookery.IRegistry.P_MAP);
	},

	members: {

		__partitions: null,
		__attributes: null,

		// Partitions

		createPartition: function(partitionName) {
			this.__createPartition(partitionName);
		},

		// Elements

		get: function(partitionName, elementName, required) {
			var partition = this.__getPartition(partitionName);
			var element = partition[elementName];
			if(element === undefined && required === true)
				throw new Error("Required element '" + elementName + "' missing from partition '" + partitionName + "'");
			return element;
		},

		keys: function(partitionName) {
			var partition = this.__getPartition(partitionName);
			return Object.keys(partition);
		},

		put: function(partitionName, elementName, element) {
			if(element === undefined)
				throw new Error("Illegal call to put() with an undefined element");
			var partition = this.__getPartition(partitionName);
			var previousElement = partition[elementName];
			if(previousElement)
				this.debug("Registration of element '" + elementName + "' in partition '" + partitionName + "' replaced existing element");
			partition[elementName] = element;
		},

		remove: function(partitionName, elementName) {
			var partition = this.__getPartition(partitionName);
			delete partition[elementName];
		},

		// Attributes

		getAttributeType: function(attributeName) {
			return this.__attributes[attributeName];
		},

		// Services

		getService: function(serviceName) {
			var serviceClass = this.get(qookery.IRegistry.P_SERVICE, serviceName);
			if(serviceClass == null) return null;
			try {
				return serviceClass.getInstance();
			}
			catch(e) {
				this.error("Error activating service", serviceName, e);
				// Service is defunct, remove it from array of available services
				this.remove(qookery.IRegistry.P_SERVICE, serviceName);
				return null;
			}
		},

		registerService: function(serviceName, serviceClass) {
			this.put(qookery.IRegistry.P_SERVICE, serviceName, serviceClass);
		},

		unregisterService: function(serviceName) {
			this.remove(qookery.IRegistry.P_SERVICE, serviceName);
		},

		// Model providers

		getModelProvider: function(providerName) {
			if(providerName == null) return this.getService("qookery.IModelProvider");
			var providerClass = this.get(qookery.IRegistry.P_MODEL_PROVIDER, providerName, true);
			return providerClass.getInstance();
		},

		registerModelProvider: function(providerName, providerClass, setDefault) {
			this.put(qookery.IRegistry.P_MODEL_PROVIDER, providerName, providerClass);
			if(setDefault) this.registerService("qookery.IModelProvider", providerClass);
		},

		// Components

		isComponentTypeAvailable: function(componentQName) {
			return this.get(qookery.IRegistry.P_COMPONENT, componentQName) !== undefined;
		},

		registerComponentType: function(componentQName, componentClass) {
			this.put(qookery.IRegistry.P_COMPONENT, componentQName, componentClass);
		},

		createComponent: function(componentQName, parentComponent) {
			var componentClass = this.get(qookery.IRegistry.P_COMPONENT, componentQName, true);
			return new componentClass(parentComponent);
		},

		// Validators

		registerValidator: function(name, validator) {
			this.put(qookery.IRegistry.P_VALIDATOR, name, validator);
		},

		getValidator: function(name) {
			return this.get(qookery.IRegistry.P_VALIDATOR, name);
		},

		// Media queries

		getMediaQuery: function(name) {
			var query = this.get(qookery.IRegistry.P_MEDIA_QUERY, name);
			if(query == null) return null;
			if(qx.lang.Type.isString(query)) {
				query = new qx.bom.MediaQuery(query);
				this.put(qookery.IRegistry.P_MEDIA_QUERY, name, query);
			}
			return query;
		},

		// Formats

		getFormat: function(formatName) {
			return this.get(qookery.IRegistry.P_FORMAT, formatName);
		},

		registerFormat: function(formatName, format) {
			this.put(qookery.IRegistry.P_FORMAT, formatName, format);
			format.dispose = function() {
				// Registered formats are immortal
			};
		},

		registerFormatFactory: function(factoryName, formatClass) {
			this.put(qookery.IRegistry.P_FORMAT_FACTORY, factoryName, formatClass);
		},

		createFormat: function(specification, options) {
			var colonPos = specification.indexOf(":");
			if(colonPos === -1 && options === undefined) {
				var format = this.get(qookery.IRegistry.P_FORMAT, specification);
				if(format) return format;
			}
			var factoryName = specification;
			if(options === undefined) options = { };
			if(colonPos !== -1) {
				factoryName = specification.slice(0, colonPos);
				specification.slice(colonPos + 1).replace(/([^=,]+)=([^,]*)/g, function(m, key, value) {
					key = qx.lang.String.clean(key);
					value = qx.lang.String.clean(value);
					options[key] = value;
				});
			}
			var formatClass = this.get(qookery.IRegistry.P_FORMAT_FACTORY, factoryName, true);
			return new formatClass(options);
		},

		// Maps

		getMap: function(mapName) {
			return this.get(qookery.IRegistry.P_MAP, mapName);
		},

		registerMap: function(mapName, map) {
			this.put(qookery.IRegistry.P_MAP, mapName, map);
		},

		// Libraries

		getLibrary: function(name, required) {
			return this.get(qookery.IRegistry.P_LIBRARY, name, required);
		},

		isLibraryLoaded: function(name) {
			var library = this.get(qookery.IRegistry.P_LIBRARY, name, false);
			if(library == null) return false;
			return library.isLoaded();
		},

		registerLibrary: function(name, resourceUris, dependencies, postLoadCallback) {
			var library = new qookery.internal.util.Library(name, resourceUris, dependencies, postLoadCallback);
			this.put(qookery.IRegistry.P_LIBRARY, name, library);
		},

		loadLibrary: function(libraryNames, continuation, thisArg) {
			var libraryName = libraryNames;
			if(qx.lang.Type.isArray(libraryNames)) {
				libraryName = libraryNames[0];
				if(libraryNames.length >= 2) {
					libraryNames = libraryNames.slice(1);
					var originalContinuation = continuation;
					continuation = function(error) {
						if(error != null) return originalContinuation(error);
						qookery.internal.Registry.getInstance().loadLibrary(libraryNames, originalContinuation, thisArg);
					};
				}
			}
			if(!libraryName) return continuation.call(thisArg);
			var library = this.get(qookery.IRegistry.P_LIBRARY, libraryName, true);
			library.load(continuation, thisArg);
		},

		// Commands

		getCommand: function(commandName) {
			return this.get(qookery.IRegistry.P_COMMAND, commandName);
		},

		registerCommand: function(commandName, command) {
			this.put(qookery.IRegistry.P_COMMAND, commandName, command);
		},

		// Cell renders

		getCellRendererFactory: function(cellRendererName, required) {
			return this.get(qookery.IRegistry.P_CELL_RENDERER_FACTORY, cellRendererName, required);
		},

		registerCellRendererFactory: function(cellRendererName, cellRendererFactory) {
			this.put(qookery.IRegistry.P_CELL_RENDERER_FACTORY, cellRendererName, cellRendererFactory);
		},

		// Internals

		__getPartition: function(name) {
			var partition = this.__partitions[name];
			if(partition === undefined) throw new Error("Unknown partition '" + name + "'");
			return partition;
		},

		__createPartition: function(name) {
			var partition = this.__partitions[name];
			if(partition !== undefined) throw new Error("Partition '" + name + "' is already defined");
			this.__partitions[name] = partition = { };
			return partition;
		}
	}
});

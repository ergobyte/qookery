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

/**
 * The FormParser will parse a form XML document to create
 * a fully populated IFormComponent into a container composite
 */
qx.Class.define("qookery.internal.FormParser", {

	extend: qx.core.Object,
	implement: [ qookery.IFormParser ],

	statics: {

		REGISTRY: qookery.internal.Registry.getInstance(),

		NAMED_SIZES: { "XXS": 28, "XS": 46, "S": 74, "M": 120, "L": 194, "XL": 314, "XXL": 508 }
	},

	construct: function(variables, serviceResolver) {
		this.base(arguments);
		if(qx.core.Environment.get("qx.debug")) {
			this.assertMap(variables);
			this.assertFunction(serviceResolver);
		}
		this.__namespaces = { };
		this.__variables = variables;
		this.__serviceResolver = serviceResolver;
	},

	members: {

		__defaultNamespace: null,
		__namespaces: null,
		__variables: null,
		__serviceResolver: null,

		// IFormParser implementation

		getVariables: function() {
			return this.__variables;
		},

		getServiceResolver: function() {
			return this.__serviceResolver;
		},

		parseXmlDocument: function(xmlDocument, parentComponent) {
			if(xmlDocument == null) throw new Error("An XML form must be supplied.");
			var elements = qx.dom.Hierarchy.getChildElements(xmlDocument);
			var rootElement = elements[0];
			var attributes = rootElement.attributes;
			for(var i = 0; i < attributes.length; i++) {
				var attribute = attributes.item(i);
				var attributeName = attribute.nodeName;
				if(attributeName === "xmlns")
					this.__defaultNamespace = attribute.value;
				else if(attributeName.indexOf("xmlns:") === 0)
					this.__namespaces[attributeName.substr(6)] = attribute.value;
			}
			var rootComponent = this.__parseComponent(rootElement, parentComponent);
			return rootComponent;
		},

		parseAttributes: function(component, xmlElement, typeMap) {
			var attributes = { };
			var xmlAttributes = xmlElement.attributes;
			for(var i = 0; i < xmlAttributes.length; i++) {
				var xmlAttribute = xmlAttributes.item(i);
				var attributeName = xmlAttribute.nodeName;
				var text = xmlAttribute.value;
				if(text == null || text.length == 0) continue;
				text = text.trim();
				if(text.length == 0) continue;
				var type = (typeMap ? typeMap[attributeName] : undefined) || component.getAttributeType(attributeName);
				var value = type ? this.parseValue(component, type, text) : text;
				attributes[attributeName] = value;
			}
			return attributes;
		},

		parseValue: function(component, type, text) {
			switch(type) {
			case "Boolean":
				switch(text.toLowerCase()) {
				case "true": return true;
				case "false": return false;
				}
				return text;
			case "Expression":
				return this.__evaluateExpression(component, text);
			case "Integer":
				return parseInt(text, 10);
			case "IntegerList":
				return text.split(/\W+/).map(function(element) { return parseInt(element, 10); });
			case "Number":
				return qx.data.Conversion.toNumber(text);
			case "NumberList":
				return text.split(/\s+/).map(function(element) { return qx.data.Conversion.toNumber(element); });
			case "RegularExpression":
				return new RegExp(text);
			case "ReplaceableString":
				if(text.length < 2) return text;
				if(text.charAt(0) !== "%") return text;
				if(text.charAt(1) === "{" && text.charAt(text.length - 1) === "}") {
					var expression = text.substring(2, text.length - 1);
					return this.__evaluateExpression(component, expression);
				}
				var messageId = text.substring(1);
				return component["tr"](messageId);
			case "QName":
				return this.resolveQName(text);
			case "Size":
				return this.constructor.NAMED_SIZES[text] || (isNaN(text) ? text : parseInt(text, 10));
			case "StringList":
				return text.split(/\s+/);
			default:
				// Fallback for unknown types
				return text;
			}
		},

		getNodeText: function(node) {
			var text = qx.dom.Node.getText(node);
			if(text == null || text.length == 0) return null;
			text = text.trim();
			if(text.length == 0) return null;
			return text;
		},

		getAttribute: function(element, attributeName, defaultValue) {
			var text = qx.xml.Element.getAttributeNS(element, "", attributeName);
			if(text == null || text.length == 0) return defaultValue;
			text = text.trim();
			if(text.length == 0) return defaultValue;
			return text;
		},

		setNamespacePrefix: function(prefix, namespaceUri) {
			this.__namespaces[prefix] = namespaceUri;
		},

		resolveNamespacePrefix: function(prefix) {
			return this.__namespaces[prefix];
		},

		resolveQName: function(qName) {
			if(qName.charAt(0) === "{") return qName;
			var colonPos = qName.indexOf(":");
			if(colonPos === -1)
				return "{" + this.__defaultNamespace + "}" + qName;
			var prefix = qName.substr(0, colonPos);
			var namespaceUri = this.resolveNamespacePrefix(prefix);
			if(!namespaceUri)
				throw new Error(qx.lang.String.format("Unable to resolve namespace prefix '%1'", [ prefix ]));
			var localPart = qName.substring(colonPos + 1);
			return "{" + namespaceUri + "}" + localPart;
		},

		// Internal methods

		__parseComponent: function(componentElement, parentComponent) {

			// Instantiate and initialize new component

			var elementName = qx.dom.Node.getName(componentElement);
			var componentQName = this.resolveQName(elementName);
			var component = this.constructor.REGISTRY.createComponent(componentQName, parentComponent);
			try {
				component.prepare(this, componentElement);

				// Id registration

				var componentId = this.getAttribute(componentElement, "id");
				if(componentId != null && parentComponent != null)
					parentComponent.getForm().putComponent(componentId, component);

				// Attribute parsing

				var attributes = this.parseAttributes(component, componentElement);
				var useAttributes = this.getAttribute(componentElement, "use-attributes");
				if(useAttributes != null) useAttributes.split(/\s+/).forEach(function(variableName) {
					var useAttributes = component.getForm().getVariable(variableName);
					if(!qx.lang.Type.isObject(useAttributes))
						throw new Error("Variable specified in use-attributes not found or of incorrect type");
					qx.lang.Object.mergeWith(attributes, useAttributes);
				});

				// Component creation

				component.create(attributes);

				// Children parsing

				this.__parseStatementBlock(componentElement, component);

				// Component setup

				component.setup(this, attributes);

				// Attach to container

				if(parentComponent != null) {
					var display = this.getAttribute(componentElement, "display", "inline");
					switch(display) {
					case "inline":
						if(!qx.Class.hasInterface(parentComponent.constructor, qookery.IContainerComponent))
							throw new Error("Attempted to add a component to a non-container component");
						parentComponent.add(component);
						break;
					case "none":
						// Do nothing
						break;
					default:
						throw new Error("Unsupported display attribute value");
					}
				}

				// Return new component
				var c = component;
				component = null;
				return c;
			}
			finally {
				if(component != null)
					component.dispose();
			}
		},

		__parseStatementBlock: function(blockElement, component) {
			if(!qx.dom.Element.hasChildren(blockElement)) return;
			var selectionMade = false;
			var children = qx.dom.Hierarchy.getChildElements(blockElement);
			for(var i = 0; i < children.length; i++) {
				var statementElement = children[i];
				var elementName = qx.dom.Node.getName(statementElement);
				if(elementName === "parsererror")
					throw new Error(qx.lang.String.format("Parser error in statement block: %1", [ qx.dom.Node.getText(statementElement) ]));
				var elementQName = this.resolveQName(elementName);

				// First consult the component registry
				if(this.constructor.REGISTRY.isComponentTypeAvailable(elementQName)) {
					this.__parseComponent(statementElement, component);
					continue;
				}

				// Then check a number of special elements known by parser
				switch(elementQName) {
				case "{http://www.qookery.org/ns/Form}else":
					if(selectionMade) continue;
					// Fall through
				case "{http://www.qookery.org/ns/Form}if":
					selectionMade = this.__parseIfElse(statementElement, component);
					continue;
				case "{http://www.qookery.org/ns/Form}script":
					this.__parseScript(statementElement, component);
					continue;
				case "{http://www.qookery.org/ns/Form}switch":
					this.__parseSwitch(statementElement, component);
					continue;
				case "{http://www.w3.org/2001/XInclude}include":
					this.__parseXInclude(statementElement, component);
					continue;
				}

				// Lastly, attempt to delegate element parsing to current component
				if(component.parseCustomElement(this, statementElement)) {
					continue;
				}

				// Since everything failed, break parser execution here
				throw new Error(qx.lang.String.format("Unexpected XML element '%1' in statement block", [ elementQName ]));
			}
		},

		__parseXInclude: function(xIncludeElement, parentComponent) {
			var formUrl = this.getAttribute(xIncludeElement, "href");
			formUrl = this.parseValue(parentComponent, "ReplaceableString", formUrl);
			var xmlString = qookery.Qookery.getService("qookery.IResourceLoader", true).loadResource(formUrl);
			var xmlDocument = qx.xml.Document.fromString(xmlString);
			var formParser = new qookery.internal.FormParser(this.__variables, this.__serviceResolver);
			try {
				var component = formParser.parseXmlDocument(xmlDocument, parentComponent);
				var xmlIdAttribute = xIncludeElement.attributes["xml:id"];
				if(xmlIdAttribute)
					parentComponent.getForm().putComponent(xmlIdAttribute.value, component);
				return component;
			}
			catch(e) {
				this.error("Error creating form editor", e);
			}
			finally {
				formParser.dispose();
			}
		},

		__parseIfElse: function(selectionElement, component) {
			var expression = this.getAttribute(selectionElement, "expression");
			if(expression != null) {
				var result = this.__evaluateExpression(component, expression);
				if(!result) return false;
			}
			var mediaQuery = this.getAttribute(selectionElement, "media-query");
			if(mediaQuery != null) {
				var query = this.__getMediaQuery(mediaQuery);
				if(!query.isMatching()) return false;
			}
			this.__parseStatementBlock(selectionElement, component);
			return true;
		},

		__parseScript: function(scriptElement, component) {
			// Load source code
			var sourceCode = this.getNodeText(scriptElement);
			var scriptUrl = this.getAttribute(scriptElement, "source");
			if(scriptUrl != null)
				sourceCode = qookery.Qookery.getService("qookery.IResourceLoader", true).loadResource(scriptUrl);
			if(sourceCode == null)
				throw new Error("Empty <script> element");

			// Compile script function
			var functionConstructorArgs = [ "$" ];
			var argumentNames = this.getAttribute(scriptElement, "arguments");
			if(argumentNames != null) {
				Array.prototype.push.apply(functionConstructorArgs, argumentNames.split(/\s+/));
			}
			else if(this.getAttribute(scriptElement, "event") != null) {
				// For backward compatibility, add the implied "event" argument
				functionConstructorArgs.push("event");
			}
			functionConstructorArgs.push(sourceCode);
			var scriptFunction; try {
				scriptFunction = Function.apply(null, functionConstructorArgs);
			}
			catch(e) {
				throw new Error("Error compiling script '" + sourceCode.truncate(50) + "': " + e.message);
			}

			// Preload some XML attributes
			var actionNames = this.getAttribute(scriptElement, "action");
			var functionNames = this.getAttribute(scriptElement, "name");
			var eventNames = this.getAttribute(scriptElement, "event");
			var mediaQuery = this.getAttribute(scriptElement, "media-query");
			var onlyOnce = this.getAttribute(scriptElement, "once") === "true";
			var preventRecursion = this.getAttribute(scriptElement, "recursion") === "prevent";
			var debounceMillis = parseInt(this.getAttribute(scriptElement, "debounce"), 10) || 0;
			var execute = this.getAttribute(scriptElement, "execute") === "true";
			if(!execute && (actionNames == null && functionNames == null && eventNames == null && mediaQuery == null)) execute = true;

			// Create list of target components
			var componentIds = this.getAttribute(scriptElement, "component");
			var components = componentIds == null ? [ component ] :
				componentIds.split(/\s+/).map(function(componentId) {
					return component.getForm().getComponent(componentId, true);
				});

			// Apply requested operations to all target components
			components.forEach(function(component) {
				var componentFunction = function() {
					if(component.isDisposed()) return;
					if(preventRecursion && componentFunction.__isRunning === true) return;
					var scriptArguments = Array.prototype.slice.call(arguments);
					scriptArguments.unshift(component.getForm().getScriptingContext());
					try {
						componentFunction.__isRunning = true;
						return scriptFunction.apply(component, scriptArguments);
					}
					catch(error) {
						qookery.util.Debug.logScriptError(component, scriptFunction.toString(), error);
						throw error;
					}
					finally {
						componentFunction.__isRunning = false;
					}
				}
				if(debounceMillis > 0) {
					var debounceFunction = componentFunction;
					componentFunction = function() {
						var timerId = debounceFunction.__timerId;
						if(timerId != null) {
							debounceFunction.__timerId = null;
							clearTimeout(timerId);
						}
						var bindArguments = [ this ];
						Array.prototype.push.apply(bindArguments, arguments);
						var setTimoutFunction = Function.prototype.bind.apply(debounceFunction, bindArguments);
						debounceFunction.__timerId = setTimeout(setTimoutFunction, debounceMillis);
					};
				}
				if(mediaQuery != null) {
					var query = this.__getMediaQuery(mediaQuery);
					if(!(execute && onlyOnce)) {
						var methodName = onlyOnce ? "addListenerOnce" : "addListener";
						var listenerId = query[methodName]("change", function(data) {
							componentFunction(data["matches"], data["query"]);
						});
						component.addToDisposeList({ dispose: function() {
							query.removeListenerById(listenerId);
						} });
					}
					if(execute) componentFunction(query.isMatching(), mediaQuery);
				}
				else {
					if(functionNames != null) functionNames.split(/\s+/).forEach(function(functionName) {
						component.getForm().getScriptingContext()[functionName] = componentFunction;
					});
					if(actionNames != null) actionNames.split(/\s+/).forEach(function(actionName) {
						component.setAction(actionName, componentFunction);
					});
					if(eventNames != null) eventNames.split(/\s+/).forEach(function(eventName) {
						component.addEventHandler(eventName, componentFunction, onlyOnce);
					});
					if(execute) componentFunction();
				}
			}, this);
		},

		__parseSwitch: function(switchElement, component) {
			if(!qx.dom.Element.hasChildren(switchElement)) return;
			var switchExpression = this.getAttribute(switchElement, "expression");
			var switchResult = this.__evaluateExpression(component, switchExpression);
			var children = qx.dom.Hierarchy.getChildElements(switchElement);
			for(var i = 0; i < children.length; i++) {
				var caseElement = children[i];
				var elementName = qx.dom.Node.getName(caseElement);
				if(elementName !== "case")
					throw new Error(qx.lang.String.format("Unexpected element in switch block: %1", [ qx.dom.Node.getText(switchElement) ]));
				var caseExpression = this.getAttribute(caseElement, "expression");
				if(caseExpression != null) {
					var caseResult = this.__evaluateExpression(component, caseExpression);
					if(caseResult != switchResult) continue;
				}
				this.__parseStatementBlock(caseElement, component);
				return true;
			}
			return false;
		},

		__getMediaQuery: function(mediaQuery) {
			var query = this.constructor.REGISTRY.getMediaQuery(mediaQuery);
			if(query != null)
				return query;
			return new qx.bom.MediaQuery(mediaQuery);
		},

		__evaluateExpression: function(component, expression) {
			if(!component) throw new Error("Illegal attempt to evaluate an expression without a parent component");
			var clientCode = "return (" + expression + ");";
			return component.executeClientCode(clientCode);
		}
	},

	destruct: function() {
		this.__namespaces = null;
	}
});

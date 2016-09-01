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

	construct: function(variables) {
		this.base(arguments);
		this.__namespaces = { };
		this.__variables = variables;
	},

	members: {

		__defaultNamespace: null,
		__namespaces: null,
		__variables: null,

		// IFormParser implementation

		getVariables: function() {
			return this.__variables;
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
				if("%none" == text) return text;
				if(text.charAt(1) === "{" && text.charAt(text.length - 1) === "}") {
					var expression = text.substring(2, text.length - 1);
					return this.__evaluateExpression(component, expression);
				}
				var messageId = text.substring(1);
				return component["tr"](messageId);
			case "QName":
				return this.__resolveQName(text);
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

		getAttribute: function(element, attributeName) {
			var text = qx.xml.Element.getAttributeNS(element, "", attributeName);
			if(text == null || text.length == 0) return null;
			text = text.trim();
			if(text.length == 0) return null;
			return text;
		},

		setNamespacePrefix: function(prefix, namespaceUri) {
			this.__namespaces[prefix] = namespaceUri;
		},

		resolveNamespacePrefix: function(prefix) {
			return this.__namespaces[prefix];
		},

		// Internal methods

		__parseComponent: function(componentElement, parentComponent) {

			// Check conditionals

			var skipIfExpression = this.getAttribute(componentElement, "skip-if");
			if(skipIfExpression) {
				var skip = this.__evaluateExpression(parentComponent, skipIfExpression);
				if(skip) return null;
			}

			// Instantiate and initialize new component

			var elementName = qx.dom.Node.getName(componentElement);
			var componentQName = this.__resolveQName(elementName);
			var component = this.constructor.REGISTRY.createComponent(componentQName, parentComponent);
			component.prepare(this, componentElement);

			// Id registration

			var componentId = this.getAttribute(componentElement, "id");
			if(componentId && parentComponent != null)
				parentComponent.getForm().putComponent(componentId, component);

			// Attribute parsing

			var attributes = this.parseAttributes(component, componentElement);

			// Component creation
			component.create(attributes);

			// Children parsing

			this.__parseStatementBlock(componentElement, component);

			// Component setup

			component.setup(this, attributes);

			// Attach to container

			if(parentComponent != null) {
				var display = this.getAttribute(componentElement, "display");
				if(!display) display = "inline";
				if(!qx.Class.hasInterface(parentComponent.constructor, qookery.IContainerComponent))
					throw new Error("Attempted to add a component to a non-container component");
				parentComponent.add(component, display);
			}

			// Return new component
			return component;
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
				var elementQName = this.__resolveQName(elementName);

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
			var xmlString = qookery.Qookery.getService("ResourceLoader").loadResource(formUrl);
			var xmlDocument = qx.xml.Document.fromString(xmlString);
			var formParser = new qookery.internal.FormParser(this.__variables);
			try {
				var component = formParser.parseXmlDocument(xmlDocument, parentComponent);
				var xmlIdAttribute = xIncludeElement.attributes["xml:id"];
				if(xmlIdAttribute)
					parentComponent.getForm().putComponent(xmlIdAttribute.value, component);
				return component;
			}
			catch(e) {
				qx.log.Logger.error(this, "Error creating form editor", e);
			}
			finally {
				formParser.dispose();
			}
		},

		__parseIfElse: function(selectionElement, component) {
			var expression = this.getAttribute(selectionElement, "expression");
			if(expression) {
				var result = this.__evaluateExpression(component, expression);
				if(!result) return false;
			}
			this.__parseStatementBlock(selectionElement, component);
			return true;
		},

		__parseScript: function(scriptElement, component) {
			var clientCode = this.getNodeText(scriptElement);

			var scriptUrl = this.getAttribute(scriptElement, "source");
			if(scriptUrl)
				clientCode = qookery.Qookery.getService("ResourceLoader").loadResource(scriptUrl);

			if(clientCode == null)
				throw new Error("Empty <script> element");

			var execute = true;

			var components = [ component ];
			var componentIds = this.getAttribute(scriptElement, "component");
			if(componentIds) {
				var form = component.getForm();
				components.length = 0;
				componentIds.split(/\s+/).forEach(function(componentId) {
					var component = form.getComponent(componentId);
					if(!component)
						throw new Error(qx.lang.String.format("Reference to unregistered component '%1'", [ componentId ]));
					components.push(component);
				});
			}

			var eventNames = this.getAttribute(scriptElement, "event");
			if(eventNames) {
				var onlyOnce = this.getAttribute(scriptElement, "once") === "true";
				eventNames.split(/\s+/).forEach(function(eventName) {
					components.forEach(function(component) {
						component.addEventHandler(eventName, clientCode, onlyOnce);
					});
				});
				execute = this.getAttribute(scriptElement, "execute") === "true";
			}

			var actionName = this.getAttribute(scriptElement, "action");
			if(actionName) {
				components.forEach(function(component) {
					component.setAction(actionName, clientCode);
				});
				execute = this.getAttribute(scriptElement, "execute") === "true";
			}

			var functionName = this.getAttribute(scriptElement, "name");
			if(functionName) {
				var argumentNames = this.getAttribute(scriptElement, "arguments");
				if(argumentNames)
					argumentNames = argumentNames.split(/\s+/);
				components.forEach(function(component) {
					component.getForm().getClientCodeContext()[functionName] = function() {
						var argumentMap = { };
						if(argumentNames) for(var i = 0; i < argumentNames.length; i++)
							argumentMap[argumentNames[i]] = arguments[i];
						return component.executeClientCode(clientCode, argumentMap);
					}
				});
				execute = this.getAttribute(scriptElement, "execute") === "true";
			}
			if(execute) components.forEach(function(component) {
				component.executeClientCode(clientCode);
			});
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
				if(caseExpression) {
					var caseResult = this.__evaluateExpression(component, caseExpression);
					if(caseResult != switchResult) continue;
				}
				this.__parseStatementBlock(caseElement, component);
				return true;
			}
			return false;
		},

		__resolveQName: function(qname) {
			var colonPos = qname.indexOf(":");
			if(colonPos === -1)
				return "{" + this.__defaultNamespace + "}" + qname;
			var prefix = qname.substr(0, colonPos);
			var namespaceUri = this.resolveNamespacePrefix(prefix);
			if(!namespaceUri)
				throw new Error(qx.lang.String.format("Unable to resolve namespace prefix '%1'", [ prefix ]));
			var localPart = qname.substring(colonPos + 1);
			return "{" + namespaceUri + "}" + localPart;
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

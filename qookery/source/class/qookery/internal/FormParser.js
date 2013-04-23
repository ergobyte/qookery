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
 * The FormParser will parse a form XML document to create
 * a fully populated IFormComponent into a container composite
 */
qx.Class.define("qookery.internal.FormParser", {

	extend: qx.core.Object,
	implement: [ qookery.IFormParser ],

	statics: {

		registry: qookery.internal.Registry.getInstance(),

		namedSizes: {
			"XXS":  28,
			"XS" :  46,
			"S"  :  74,
			"M"  : 120,
			"L"  : 194,
			"XL" : 314,
			"XXL": 508
		}
	},

	construct: function(variables) {
		this.base(arguments);
		this.__namespaces = { };
		this.__variables = variables;
	},

	members: {

		__namespaces: null,
		__variables: null,

		// IFormParser implementation

		parseXmlDocument: function(xmlDocument, parentComponent) {
			if(xmlDocument == null) throw new Error("An XML form must be supplied.");
			var elements = qx.dom.Hierarchy.getChildElements(xmlDocument);
			var rootElement = elements[0];
			var attributes = rootElement.attributes;
			for(var i = 0; i < attributes.length; i++) {
				var attribute = attributes.item(i);
				var attributeName = attribute.nodeName;
				if(attributeName.indexOf("xmlns:") == 0) {
					var prefix = attributeName.substr(6);
					var uri  = attribute.nodeValue;
					this.__namespaces[prefix] = uri;
				}
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
				var text = xmlAttribute.nodeValue;
				if(text == null || text.length == 0) continue;
				text = text.trim();
				if(text.length == 0) continue;
				var type = typeMap ? typeMap[attributeName] : component.getAttributeType(attributeName);
				var value = type ? this.parseValue(component, type, text) : text;
				attributes[attributeName] = value;
			}
			return attributes;
		},

		parseValue: function(component, type, text) {
			switch(type) {
			case "Integer":
				return parseInt(text);
			case "Boolean":
				return text == "true";
			case "Size":
				return this.constructor.namedSizes[text] || (isNaN(text) ? text : parseInt(text));
			case "IntegerList":
				var value = text.split(/\W+/);
				value.forEach(function(element, index) { value[index] = parseInt(element); });
				return value;
			case "RegularExpression":
				return new RegExp(text);
			case "ReplaceableString":
				if(text.length < 2) return text;
				if(text.charAt(0) != '%') return text;
				if("%none" == text) return text;
				if(text.charAt(1) == '{' && text.charAt(text.length-1) == '}') {
					var expression = text.substring(2, text.length-1);
					return component.executeClientCode(qx.lang.String.format("return (%1);", [ expression ]));
				}
				var messageId = text.substring(1);
				return component['tr'](messageId);
			case "QName":
				return this.__resolveQName(text);
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

		// Internal methods

		__parseComponent: function(componentElement, parentComponent) {

			// Check conditionals

			var skipIfClientCode = this.getAttribute(componentElement, "skip-if");
			if(skipIfClientCode) {
				if(parentComponent == null) throw new Error("skip-if attribute needs a parent component");
				var skip = parentComponent.executeClientCode(qx.lang.String.format("return (%1);", [ skipIfClientCode ]));
				if(skip) return null;
			}

			// Instantiate new component

			var componentTypeName = qx.dom.Node.getName(componentElement);
			var component = this.constructor.registry.createComponent(componentTypeName, parentComponent);

			// TODO Find a less ugly way to pass parser variables to form components
			if(component instanceof qookery.internal.components.FormComponent)
				component.setVariables(this.__variables);

			// Id registration

			var componentId = this.getAttribute(componentElement, "id");
			if(componentId && parentComponent != null)
				parentComponent.getForm().registerComponent(component, componentId);

			// Attribute parsing

			var attributes = this.parseAttributes(component, componentElement);

			// Component creation

			component.create(attributes);

			// Children parsing

			this.__parseStatementBlock(componentElement, component);

			// Component setup

			component.setup(attributes);

			// Attach to container

			if(parentComponent != null) {
				var display = this.getAttribute(componentElement, "display");
				if(!display) display = 'inline';
				if(!qx.Class.hasInterface(parentComponent.constructor, qookery.IContainerComponent))
					throw new Error("Attempted to add a component to a non-container component");
				parentComponent.add(component, display);
			}

			// Return new component
			return component;
		},

		__parseStatementBlock: function(blockElement, component) {
			if(!qx.dom.Element.hasChildren(blockElement)) return;
			var children = qx.dom.Hierarchy.getChildElements(blockElement);
			for(var i = 0; i < children.length; i++) {
				var statementElement = children[i];
				var elementName = qx.dom.Node.getName(statementElement);
				switch(elementName) {
				case "xi:include":
					this.__parseXInclude(statementElement, component); continue;
				case "script":
					this.__parseScript(statementElement, component); continue;
				case "parseerror":
					throw new Error(qx.lang.String.format("Parser error in statement block: %1", [ qx.dom.Node.getText(statementElement) ]));
				default:
					if(this.constructor.registry.isComponentTypeAvailable(elementName))
						this.__parseComponent(statementElement, component);
					else if(!component.parseCustomElement(this, statementElement))
						throw new Error(qx.lang.String.format("Unexpected XML element '%1' in statement block", [ elementName ]));
				}
			}
		},

		__parseXInclude: function(xIncludeElement, parentComponent) {
			var formUrl = this.getAttribute(xIncludeElement, "href");
			formUrl = this.parseValue(parentComponent, "ReplaceableString", formUrl);
			var xmlString = qookery.Qookery.getResourceLoader().loadResource(formUrl);
			var xmlDocument = qx.xml.Document.fromString(xmlString);
			var formParser = new qookery.internal.FormParser(this.__variables);
			try {
				return formParser.parseXmlDocument(xmlDocument, parentComponent);
			}
			catch(e) {
				qx.log.Logger.error(this, qx.lang.String.format("Error creating form editor: %1", [ e ]));
				qx.log.Logger.error(e.stack);
			}
			finally {
				formParser.dispose();
			}
		},

		__parseScript: function(scriptElement, component) {
			var clientCode = this.getNodeText(scriptElement);
			if(clientCode == null)
				throw new Error("Empty <script> element");
			var componentId = this.getAttribute(scriptElement, "component");
			if(componentId) {
				component = component.getForm().getComponent(componentId);
				if(!component)
					throw new Error(qx.lang.String.format("Reference to unregistered component '%1'", [ componentId ]));
			}
			var eventName = this.getAttribute(scriptElement, "event");
			if(eventName) {
				component.addEventHandler(eventName, clientCode);
			}
			else {
				var actionName = this.getAttribute(scriptElement, "action");
				if(actionName) {
					component.setAction(actionName, clientCode);
				}
				else {
					component.executeClientCode(clientCode);
				}
			}
		},

		__resolveQName: function(qname) {
			var parts = qname.split(":");
			if(parts.length == 1) return [ "", qname ];
			var prefix = parts[0];
			var localPart = parts[1];
			var namespaceUri = this.__namespaces[prefix];
			if(!namespaceUri) throw new Error(qx.lang.String.format("Unable to resolve unknown namespace prefix '%1'", [ prefix ]));
			return [ namespaceUri, localPart ];
		}
	},

	destruct: function() {
		this.__namespaces = null;
	}
});

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
		},

		componentAttributeTypes: {
			"column-span": "Integer",
			"margin-bottom": "Integer",
			"margin-left": "Integer",
			"margin-right": "Integer",
			"margin-top": "Integer",
			"maximum": "Integer",
			"max-length": "Integer",
			"minimum": "Integer",
			"padding-bottom": "Integer",
			"padding-left": "Integer",
			"padding-right": "Integer",
			"padding-top": "Integer",
			"page-step": "Integer",
			"row-height": "Integer",
			"row-span": "Integer",
			"single-step": "Integer",
			"spacing": "Integer",
			"spacing-x": "Integer",
			"spacing-y": "Integer",

			"center": "Boolean",
			"column-visibility-button-visible": "Boolean",
			"enabled": "Boolean",
			"read-only": "Boolean",
			"required": "Boolean",
			"rich": "Boolean",
			"status-bar-visible": "Boolean",
			"stretch": "Boolean",
			"stretch-x": "Boolean",
			"stretch-y": "Boolean",
			"visible": "Boolean",
			"wrap": "Boolean",

			"width": "Size",
			"height": "Size",
			"min-width": "Size",
			"min-height": "Size",
			"max-width": "Size",
			"max-height": "Size",

			"icon": "Resource",
			"source": "Resource",

			"margin": "IntegerList",
			"padding": "IntegerList",

			"filter": "RegularExpression",
			
			"label": "TranslatableString",
			"placeholder": "TranslatableString",
			"title": "TranslatableString",
			
			"connect": "QName"
		}
	},

	construct: function() {
		this.base(arguments);
		this.__namespaces = { };
	},

	members: {

		__namespaces: null,

		// IFormParser implementation

		create: function(xmlDocument, parentComposite, layoutData) {
			if(xmlDocument == null) throw new Error("An XML form must be supplied.");
			if(parentComposite == null) throw new Error("Parent composite must be supplied");
			var elements = qx.dom.Hierarchy.getChildElements(xmlDocument);
			var formElement = elements[0];

			var translationPrefix = this.getAttribute(formElement, "translation-prefix");
			var component = new qookery.internal.components.FormComponent(null, translationPrefix);
			this.__parseFormBlock(formElement, component);
			this.__parseComponent2(formElement, component);

			var formWidget = component.getMainWidget();
			parentComposite.add(formWidget, layoutData);

			return component;
		},

		parseAttributes: function(component, attributeTypes, xmlElement) {
			var attributes = { };
			var xmlAttributes = xmlElement.attributes;
			for(var i = 0; i < xmlAttributes.length; i++) {
				var xmlAttribute = xmlAttributes.item(i);
				var attributeName = xmlAttribute.nodeName;
				var text = xmlAttribute.nodeValue;
				if(text == null || text.length == 0) continue;
				text = text.trim();
				if(text.length == 0) continue;
				var value = this.__convertAttributeValue(component, attributeTypes, attributeName, text);
				attributes[attributeName] = value;
			}
			return attributes;
		},

		getAttribute: function(element, attributeName) {
			var text = qx.xml.Element.getAttributeNS(element, null, attributeName);
			if(text == null || text.length == 0) return null;
			text = text.trim();
			if(text.length == 0) return null;
			return text;
		},

		// Internal methods

		__parseComponent: function(componentElement, parentComponent) {

			// Check conditionals

			var skipIfClientCode = this.getAttribute(componentElement, "skip-if");
			if(skipIfClientCode) {
				var skip = parentComponent.executeClientCode(qx.lang.String.format("return (%1);", [ skipIfClientCode ]));
				if(skip) return;
			}

			// Instantiate new component
			
			var componentType = qx.dom.Node.getName(componentElement);
			if(componentType == "component")
				componentType = this.getAttribute(componentElement, "type");
			
			var component = this.constructor.registry.createComponent(parentComponent, componentType);
			var componentId = this.getAttribute(componentElement, "id");
			if(componentId)
				component.getForm().registerComponent(component, componentId);
			
			// Continue creation process

			this.__parseComponent2(componentElement, component);

			// Attach to container

			parentComponent.addChild(component);
		},

		__parseComponent2: function(componentElement, component) {
			
			// Attribute parsing

			var attributes = this.parseAttributes(component, this.constructor.componentAttributeTypes, componentElement);

			// Component creation
			
			component.create(attributes);

			// Children parsing

			this.__parseStatementBlock(componentElement, component);

			// Component setup

			component.setup(attributes);
		},

		__parseFormBlock: function(formElement, formComponent) {
			if(!qx.dom.Element.hasChildren(formElement)) return;
			var children = qx.dom.Hierarchy.getChildElements(formElement);
			for(var i = 0; i < children.length; i++) {
				var statementElement = children[i];
				var elementName = qx.dom.Node.getName(statementElement);
				if(elementName == 'import')
					this.__parseImport(statementElement, formComponent);
				else if(elementName == 'bind')
					this.__parseBind(statementElement, formComponent);
				else if(elementName == 'translation')
					this.__parseTranslation(statementElement, formComponent);
			}
		},

		__parseStatementBlock: function(blockElement, component) {
			if(!qx.dom.Element.hasChildren(blockElement)) return;
			var children = qx.dom.Hierarchy.getChildElements(blockElement);
			for(var i = 0; i < children.length; i++) {
				var statementElement = children[i];
				var elementName = qx.dom.Node.getName(statementElement);
				switch(elementName) {
				case "import":
				case "bind":
				case "translation":
					continue; // Parsed elsewhere
				case "script":
					this.__parseScript(statementElement, component); continue;
				case "parseerror":
					throw new Error(qx.lang.String.format("Parser error in statement block: %1", [ qx.dom.Node.getText(statementElement) ]));
				default:
					if(this.constructor.registry.isComponentAvailable(elementName))
						this.__parseComponent(statementElement, component);
					else if(!component.parseCustomElement(this, statementElement))
						throw new Error(qx.lang.String.format("Unexpected XML element '%1' in statement block", [ elementName ]));
				}
			}
		},

		__parseScript: function(scriptElement, component) {
			var clientCode = this.__getNodeText(scriptElement);
			if(clientCode == null)
				throw new Error("Empty <script> element");
			var eventName = this.getAttribute(scriptElement, "event");
			var actionName = this.getAttribute(scriptElement, "action");
			if(eventName)
				component.addEventHandler(eventName, clientCode);
			else if(actionName)
				component.setAction(actionName, clientCode);
			else
				component.executeClientCode(clientCode);
		},

		__parseImport: function(importElement, formComponent) {
			var className = this.getAttribute(importElement, "class");
			var clazz = qx.Class.getByName(className);
			if(!clazz) throw new Error(qx.lang.String.format("Imported class '%1' not found", [ className ]));
			var key = this.getAttribute(importElement, "key");
			if(!key) key = className.substring(className.lastIndexOf(".") + 1);
			formComponent.registerUserContext(key, clazz);
		},

		__parseBind: function(bindElement, formComponent) {
			var prefix = this.getAttribute(bindElement, "prefix");
			var uri = this.getAttribute(bindElement, "uri");
			this.__namespaces[prefix] = uri;
		},

		__parseTranslation: function(translationElement, formComponent) {
			if(!qx.dom.Element.hasChildren(translationElement)) return;
			var languageCode = qx.xml.Element.getAttributeNS(translationElement, 'http://www.w3.org/XML/1998/namespace', 'lang');
			if(!languageCode) throw new Error("Language code missing");
			var messages = { };
			var prefix = formComponent.getTranslationPrefix();
			var children = qx.dom.Hierarchy.getChildElements(translationElement);
			for(var i = 0; i < children.length; i++) {
				var messageElement = children[i];
				var elementName = qx.dom.Node.getName(messageElement);
				if(elementName != 'message')
					throw new Error(qx.lang.String.format("Unexpected XML element '%1' in translation block", [ elementName ]));
				var messageId = this.getAttribute(messageElement, "id");
				if(!messageId) throw new Error("Message identifier missing");
				if(prefix) messageId = prefix + '.' + messageId;
				messages[messageId] = this.__getNodeText(messageElement);
			}
			qx.locale.Manager.getInstance().addTranslation(languageCode, messages);
		},

		__getNodeText: function(node) {
			var text = qx.dom.Node.getText(node);
			if(text == null || text.length == 0) return null;
			text = text.trim();
			if(text.length == 0) return null;
			return text;
		},

		__resolveQName: function(qname) {
			var parts = qname.split(":");
			if(parts.length == 1) return [ "", qname ];
			var prefix = parts[0];
			var localPart = parts[1];
			var namespaceUri = this.__namespaces[prefix];
			if(!namespaceUri) throw new Error(qx.lang.String.format("Unable to resolve unknown namespace prefix '%1'", [ prefix ]));
			return [ namespaceUri, localPart ];
		},

		__convertAttributeValue: function(component, attributeTypes, key, text) {
			var type = attributeTypes[key];
			if(!type) return text;
			switch(type) {
			case "Integer":
				return parseInt(text);
			case "Boolean":
				return text == "true";
			case "Size":
				return this.constructor.namedSizes[text] || (isNaN(text) ? text : parseInt(text));
			case "Resource":
				return qx.util.ResourceManager.getInstance().toUri(text);
			case "IntegerList":
				var value = text.split(/\W+/);
				value.forEach(function(element, index) { value[index] = parseInt(element); });
				return value;
			case "RegularExpression":
				return new RegExp(text);
			case "TranslatableString":
				if(text.length < 2) return text;
				if(text.charAt(0) != '%') return text;
				if("%none" == text) return text;
				var messageId = text.substring(1);
				return component['tr'](messageId);
			case "QName":
				return this.__resolveQName(text);
			default:
				// Fallback for unknown types
				return text;
			}
		}
	},

	destruct: function() {
		this.__namespaces = null;
	}
});

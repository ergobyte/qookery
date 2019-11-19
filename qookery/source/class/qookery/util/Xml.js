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
 * Various utility methods helpful when working with XML documents
 */
qx.Class.define("qookery.util.Xml", {

	statics: {

		/**
		 * Return namespace declarations defined onto element, if any
		 *
		 * @param element {Element} the XML element to search for namespace declarations
		 *
		 * @return {Map?} prefix-to-URI map, or <code>null</code> if no xmlns attributes found
		 */
		getNamespaceDeclarations: function(element) {
			var namespaces = null, attributes = element.attributes;
			for(var i = 0; i < attributes.length; i++) {
				var attribute = attributes.item(i);
				var attributeName = attribute.nodeName;
				if(attributeName !== "xmlns" && attributeName.indexOf("xmlns:") !== 0) continue;
				var prefix = attributeName.length === 5 ? "" : attributeName.substr(6);
				if(namespaces == null) namespaces = { };
				namespaces[prefix] = attribute.value;
			}
			return namespaces;
		},

		/**
		 * Resolve a QName using provided namespace resolver
		 *
		 * <p>The result format is "{" + Namespace URI + "}" + local part. If the namespace URI is empty,
		 * only the local part is returned.</p>
		 *
		 * @param namespaceResolver {Function} A prefix => namespaceUri function, returning <code>null</code> when prefix is unknown
		 * @param qName {String} the QName to resolve
		 *
		 * @return {String} the string representation of the resolved QName
		 *
		 * @throws {Error} in case the QName prefix could not be resolved
		 */
		resolveQName: function(namespaceResolver, qName) {
			if(qName.charAt(0) === "{")
				return qName;
			if(namespaceResolver == null)
				throw new Error("Namespace resolver required");
			var colonPos = qName.indexOf(":");
			var prefix = colonPos === -1 ? "" : qName.substr(0, colonPos);
			var namespaceUri = namespaceResolver(prefix);
			if(namespaceUri == null) {
				switch(prefix) {
				case "":
					// The default namespace, if not specified otherwise, is the empty string
					namespaceUri = "";
					break;
				case "xml":
					// Prefix always available, according to XML 1.0 and 1.1 specifications
					namespaceUri = "http://www.w3.org/XML/1998/namespace";
					break;
				default:
					throw new Error(qx.lang.String.format("Unable to resolve namespace prefix '%1'", [ prefix ]));
				}
			}
			if(namespaceUri === "")
				return qName;
			var localPart = qName.substring(colonPos + 1);
			return "{" + namespaceUri + "}" + localPart;
		},

		/**
		 * Return the text value of an XML node, after trimming leading and trailing whitespace
		 *
		 * @param node {Node} XML node to get text from
		 *
		 * @return {String?} whitespace trimmed text or <code>null</code> if empty
		 */
		getNodeText: function(node) {
			var text = qx.dom.Node.getText(node);
			if(text == null || text.length === 0)
				return null;
			text = text.trim();
			if(text.length === 0)
				return null;
			return text;
		},

		/**
		 * Return the text value of an element's attribute, after trimming leading and trailing whitespace
		 *
		 * <p>You may supply the <code>Error</code> build-in object as the defaultValue parameter
		 * in order to request that an exception is thrown when value is missing.</p>
		 *
		 * @param element {Element} XML element holding required attribute
		 * @param attributeName {String} name of required attribute, may be fully qualified
		 * @param defaultValue {String?} the text to return in case the attribute is empty/missing
		 *
		 * @return {String} whitespace trimmed attribute value or the default value if empty/missing
		 */
		getAttribute: function(element, attributeName, defaultValue) {
			var namespaceUri = "", localPart = attributeName;
			if(attributeName.charAt(0) === "{") {
				var rightBracePos = attributeName.indexOf("}");
				if(rightBracePos === -1)
					throw new Error("Ill-formed attribute name");
				namespaceUri = attributeName.substring(1, rightBracePos);
				localPart = attributeName.substring(rightBracePos + 1);
			}
			var text = qx.xml.Element.getAttributeNS(element, namespaceUri, localPart);
			if(text != null) {
				text = text.trim();
				if(text.length !== 0)
					return text;
			}
			if(defaultValue === Error)
				throw new Error(qx.lang.String.format("Required attribute '%1' missing from XML element '%2'", [ attributeName, element ]));
			return defaultValue;
		},

		/**
		 * Parse a string of specified value type against provided component
		 *
		 * @param component {qookery.IComponent} the component that will serve as the context for evaluations
		 * @param type {String} one of the known value types
		 * @param text {String} the string to parse
		 *
		 * @return {any} the parsing result
		 */
		parseValue: function(component, type, text) {
			switch(type) {
			case "Boolean":
				switch(text.toLowerCase()) {
				case "true": return true;
				case "false": return false;
				}
				return text;
			case "Expression":
				return component.evaluateExpression(text);
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
				if(text.length < 2)
					return text;
				if(text.charAt(0) !== "%")
					return text;
				if(text.charAt(1) === "{" && text.charAt(text.length - 1) === "}") {
					var expression = text.substring(2, text.length - 1);
					switch(expression) {
					case "false":
						return false;
					case "null":
						return null;
					case "undefined":
						return undefined;
					case "true":
						return true;
					default:
						return component.evaluateExpression(expression);
					}
				}
				var messageId = text.substring(1);
				return component["tr"](messageId);
			case "QName":
				return component.resolveQName(text);
			case "Size":
				var v = qookery.util.Xml.__NAMED_SIZES[text];
				if(v !== undefined)
					return v;
				v = parseInt(text, 10);
				if(!isNaN(v))
					return v;
				return text;
			case "StringList":
				return text.split(/\s+/);
			default:
				// Fallback for unknown types
				return text;
			}
		},

		/**
		 * Parse XML element attributes according to component's attribute type mapping
		 *
		 * <p>Supported types are those of qookery.util.Xml#parseValue()</p>
		 *
		 * @param component {qookery.IComponent} Qookery component to serve as the base of any conversion
		 * @param element {Element} XML element to read attributes from
		 * @param typeMap {Map?} custom type mapping; if provided, it overrides the component's type mapping
		 *
		 * @return {Map} attribute name to converted attribute value map
		 */
		parseAllAttributes: function(component, element, typeMap) {
			var attributes = { };
			var xmlAttributes = element.attributes;
			for(var i = 0; i < xmlAttributes.length; i++) {
				var xmlAttribute = xmlAttributes.item(i);
				var attributeQName = xmlAttribute.name;
				if(attributeQName === "xmlns" || attributeQName.indexOf("xmlns:") === 0)
					continue; // Namespace declarations are handled separately
				var text = xmlAttribute.value;
				if(text == null || text.length === 0)
					continue; // Empty attributes are ignored
				text = text.trim();
				if(text.length === 0)
					continue; // Empty attribute after trimming whitespace, also ignored
				var attributeName = attributeQName;
				if(attributeQName.indexOf(":") !== -1)
					attributeName = component.resolveQName(attributeQName);
				var value = text;
				var type = (typeMap != null ? typeMap[attributeName] : undefined) || component.getAttributeType(attributeName);
				if(type != null)
					value = qookery.util.Xml.parseValue(component, type, text);
				attributes[attributeName] = value;
			}
			return attributes;
		},

		__NAMED_SIZES: {
			"null": null,
			"XXS": 28,
			"XS": 46,
			"S": 74,
			"M": 120,
			"L": 194,
			"XL": 314,
			"XXL": 508
		}
	}
});

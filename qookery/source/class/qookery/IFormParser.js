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
 * Interface providing access to some internals of the Qookery XML parser
 */
qx.Interface.define("qookery.IFormParser", {

	members: {

		/**
		 * Return variables user passed to this parser
		 *
		 * @return {Map} any number of user variables
		 */
		getVariables: function() { },

		/**
		 * Return the service resolver used by parser
		 *
		 * @return {Function} function that is being used to resolve services
		 */
		getServiceResolver: function() { },

		/**
		 * Parse and generate a Qookery form
		 *
		 * @param xmlDocument {qx.xml.Document} input DOM XML document structured according to the form.xsd schema
		 * @param parentComponent {qookery.IContainerComponent} an optional parent component that will hold generated results or <code>null</code>
		 *
		 * @return {qookery.IComponent} the root of the generated component hierarchy - typically a form component
		 */
		parseXmlDocument: function(xmlDocument, parentComponent) { },

		/**
		 * Parse XML element attributes according to component's attribute type mapping
		 *
		 * <p>Supported types are those of #parseValue()</p>
		 *
		 * @param component {qookery.IComponent} Qookery component to serve as the base of any conversion
		 * @param xmlElement {qx.xml.Element} XML element to read attributes from
		 * @param typeMap {Map} custom type mapping; if provided, it overrides the component's type mapping
		 *
		 * @return {Map} attribute name to converted attribute value map
		 */
		parseAttributes: function(component, xmlElement, typeMap) { },

		/**
		 * Convert an unparsed textual value into a usable JavaScript representation
		 *
		 * <p>Supported types are Integer, Boolean, Size, IntegerList, RegularExpression, ReplaceableString, QName</p>
		 *
		 * @param component {qookery.IComponent} Qookery component to serve as the base of any conversion
		 * @param type {String} type of expected resulting value
		 * @param text {String} unparsed textual value
		 *
		 * @return {any} parsed value
		 */
		parseValue: function(component, type, text) { },

		/**
		 * Return the (unparsed) text value of an XML node
		 *
		 * @param xmlNode {Node} XML node to get text from
		 *
		 * @return {String} whitespace trimmed text or <code>null</code> if empty
		 */
		getNodeText: function(xmlNode) { },

		/**
		 * Return the (unparsed) text value of an XML element's attribute
		 *
		 * @param xmlElement {Element} XML element holding required attribute
		 * @param attributeName {String} name of required attribute
		 *
		 * @return {String} whitespace trimmed text or <code>null</code> if empty
		 */
		getAttribute: function(xmlElement, attributeName) { },

		/**
		 * Return the namespace URI bound to a prefix, or <code>null</code> if not bound
		 *
		 * @param prefix {String} the prefix to resolve
		 * @return {String} URI or <code>null</code>
		 */
		resolveNamespacePrefix: function(prefix) { },

		/**
		 * Return the James Clark string representation of a resolved QName
		 *
		 * @param qName {String} XML QName to resolve
		 */
		resolveQName: function(qName) { }
	}
});

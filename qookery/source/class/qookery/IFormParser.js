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

qx.Interface.define("qookery.IFormParser", {

	members: {

		/**
		 * Return variables user passed to this parser, if any
		 *
		 * @return {Map} any number of user variables
		 */
		getVariables: function() { },

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
		 * <p>Supported types are Integer, Boolean, Size, URI, IntegerList, RegularExpression, ReplaceableString, QName</p>
		 *
		 * @param component {qookery.IComponent} Qookery component to serve as the base of any conversion
		 * @param xmlElement {qx.xml.Element} XML element to read attributes from
		 * @param typeMap {Map} custom type mapping; if provided, it overrides the component's type mapping
		 *
		 * @return {Map} attribute name to converted attribute value map
		 */
		parseAttributes: function(component, xmlElement, typeMap) { },

		parseValue: function(component, type, value) { },

		getNodeText: function(xmlNode) { },

		getAttribute: function(xmlElement, attributeName) { }
	}
});

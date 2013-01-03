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
		 * Parse and interpret a Qookery form
		 * 
		 * @param xmlDocument input DOM XML document structured according to the form.xsd schema
		 * @param parentComposite the Composite that will received any produced UI artifacts
		 * @param layoutData optional layout data to set to created top-level widget
		 * 
		 * @returns the newly created IFormComponent
		 */
		create: function(xmlDocument, parentComposite, layoutData) { },
		
		/**
		 * Parse XML element attributes according to a name-to-type map
		 * 
		 * <p>Supported types are Integer, Boolean, Size, URI, IntegerList, RegularExpression, ReplaceableString, QName</p>
		 * 
		 * @param component {qookery.IComponent} Qookery component to serve as the base of any conversion
		 * @param attributeTypes {Map} a map from attribute name to attribute type
		 * @param xmlElement {qx.dom.Element} XML element to read attributes from
		 * 
		 * @return {Map} attribute name to converted attribute value map
		 */
		parseAttributes: function(component, attributeTypes, xmlElement) { },

		getAttribute: function(xmlElement, attributeName) { }
	}
});

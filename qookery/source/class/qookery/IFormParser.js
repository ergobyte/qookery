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
		 * Create a Qookery form from an XML document
		 *
		 * @param xmlDocument {Document} The xml document to parse
		 * @param parentComposite {qx.ui.container.Composite} The composite that will host the newly created UI
		 * @param layoutData {Object} Layout data to set on the outermost widget of the new UI
		 */
		create: function(xmlDocument, parentComposite, layoutData) { }
	}
});

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
 * Connections permit Qookery users to create data bindings for components
 */
qx.Interface.define("qookery.IConnectionHandler", {

	members: {

		/**
		 * Handle connection specification of a connectable component
		 * 
		 * @param connectionSpecification {String} specification, as provided by the XML document
		 * @param connectableComponent {qookery.IComponent} a component that supports data binding
		 */
		handleConnection: function(connectionSpecification, connectableComponent) { }
	}
});

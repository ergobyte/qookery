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
 * Each and every Qookery user interface component implements this interface
 */
qx.Interface.define("qookery.IComponent", {

	properties: {

		/** Whether the component is enabled */
		enabled: { init: true, check: "Boolean" },

		/** Whether the component is visible */
		visible: { init: true, check: "Boolean" }
	},

	members: {

		/**
		 * Called by the parser soon after the component's constructor
		 *
		 * <p>Notice: You must never call this method directly.</p>
		 *
		 * @param attributes {Map} preprocessed attributes found in the defining XML document
		 */
		create: function(attributes) { },
		
		/**
		 * Called by the parser any time an unknown element is encounted within component's XML declaration
		 *
		 * <p>Notice: You must never call this method directly.</p>
		 *
		 * @param formParser {qookery.IFormParser} requesting form parser
		 * @param xmlElement {qx.dom.Element} XML element
		 * 
		 * @retun {Boolean} <code>true</code> in case component understood and parsed element
		 */
		parseCustomElement: function(formParser, xmlElement) { },

		/**
		 * Called by the parser after creation of the component and its children
		 *
		 * <p>Notice: You must never call this method directly.</p>
		 *
		 * @param attributes {Map} preprocessed attributes found in the defining XML document
		 */
		setup: function(attributes) { },

		/**
		 * Return the component identifier, if any
		 *
		 * <p>This identifier is guaranteed to be unique within the defining XML document</p>
		 *
		 * @return {String} unique identifier or <code>null</code>
		 */
		getId: function() { },

		/**
		 * Return an attribute from the defining XML document
		 *
		 * @param attributeName {String} the name of the required attribute
		 *
		 * @return attribute's value or <code>null</code> if undefined
		 */
		getAttribute: function(attributeName) { },

		/**
		 * Return the form containing this component
		 *
		 * @return {qookery.IFormComponent} the form containing this component
		 */
		getForm: function() { },

		/**
		 * Return the parent component or <code>null</cide> if this is the root component
		 *
		 * @return {qookery.IComponent} parent component or <code>null</code>
		 */
		getParent: function() { },

		/**
		 * Perform additional component initialization
		 *
		 * <p>This method is intended to be called by XML authors</p>
		 */
		initialize: function(initOptions) { },

		/**
		 * Set the focus to this component
		 */
		focus: function() { },

		/**
		 * Return a list of widgets that are handled by this component
		 *
		 * @param filterName {String} If set, one of 'topMost', 'main' to restrict resulting list
		 *
		 * @return {qx.ui.core.Widget[]} widget list - an empty array if none found
		 */
		listWidgets: function(filterName) { },

		/**
		 * Return the main widget
		 *
		 * <p>This method a shorthand for #listWidgets('main')[0]</p>
		 *
		 * @return {qx.ui.core.Widget} the main widget
		 */
		getMainWidget: function() { },

		/**
		 * Execute an action provided by this component
		 *
		 * <p>It is safe to call this method for undefined actions,
		 * in which case <code>null</code> is returned.</p>
		 *
		 * @param actionName {String} one the actions provided by component
		 * @param argumentMap {Map} optional name-value map to be passed as call arguments
		 *
		 * @return the action's execution result
		 */
		executeAction: function(actionName, argumentMap) { },
		
		/**
		 * Return a translated message 
		 * 
		 * @param messageId {String} the identifier of the wanted message
		 */
		tr: function(messageId) { }
	}
});

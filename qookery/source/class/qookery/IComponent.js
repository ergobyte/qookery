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
 * Each and every Qookery user interface component implements this interface
 */
qx.Interface.define("qookery.IComponent", {

	properties: {

		/** Whether the component is enabled */
		enabled: { init: true, check: "Boolean" },

		/** Whether the component is visible */
		visibility: { init: "visible", check : [ "visible", "hidden", "excluded" ] }
	},

	members: {

		/**
		 * Return the component identifier, if any
		 *
		 * <p>This identifier is guaranteed to be unique within the defining XML document</p>
		 *
		 * @return {String} unique identifier or <code>null</code>
		 */
		getId: function() { },

		/**
		 * Return the value of component's attribute
		 *
		 * <p>You may supply the default value to return in case the attribute is not defined. If you supply the global
		 * object <code>Error</code>, then an exception will be thrown instead.</p>
		 *
		 * @return {any} the attribute's value if set, the default value or <code>undefined</code> otherwise
		 */
		getAttribute: function(attributeName, defaultValue) { },

		/**
		 * Called by the parser immediately after new instance construction
		 *
		 * <p>Notice: You must never call this method directly.</p>
		 *
		 * @param formParser {qookery.IFormParser} requesting form parser
		 * @param xmlElement {qx.dom.Element} XML element that initiated component creation
		 */
		prepare: function(formParser, xmlElement) { },

		/**
		 * Called by the form parser soon after initialization and attribute parsing
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
		setup: function(formParser, attributes) { },

		/**
		 * Return an attribute value from the defining XML document
		 *
		 * <p>You may supply the <code>Error</code> build-in object as the defaultValue parameter
		 * in order to request that an exception is thrown when value is missing.</p>
		 *
		 * @param attributeName {String} the name of the wanted attribute
		 * @param defaultValue {any} value to return when attribute is missing
		 *
		 * @return {any} attribute's value or <code>null</code> if undefined
		 */
		getAttribute: function(attributeName, defaultValue) { },

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
		 * Add an event handler to this component
		 *
		 * @param eventName {String} the name of the event to listen to
		 * @param clientCode {String} the JavaScript source code to execute when the event is triggered
		 * @param onlyOnce {Boolean} if <code>true</code>, the listener will be removed as soon as it triggered for the first time
		 */
		addEventHandler: function(eventName, clientCode, onlyOnce) { },

		/**
		 * Execute an action provided by this component
		 *
		 * <p>It is safe to call this method for undefined actions,
		 * in which case <code>null</code> is returned.</p>
		 *
		 * @param actionName {String} one the actions provided by component
		 * @param argumentMap {Map} optional name-value map to be passed as call arguments
		 *
		 * @return {any} the action's execution result
		 */
		executeAction: function(actionName, argumentMap) { },

		/**
		 * Check whether the action exist or not.
		 *
		 * @param actionName {String} The name of the action
		 * @return {Boolean} Whether the action exist
		 */
		isActionSupported: function(actionName) { },

		/**
		 * Return the type of an attribute
		 *
		 * @param attributeName {String} name of the attribute
		 *
		 * @return {String} attribute's type or <code>null</code> if unknown
		 */
		getAttributeType: function(attributeName) { },

		/**
		 * Return a translated message
		 *
		 * @param messageId {String} the identifier of the wanted message
		 */
		tr: function(messageId) { }
	}
});

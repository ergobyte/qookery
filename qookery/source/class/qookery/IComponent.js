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
 * Interface implemented by all Qookery components
 */
qx.Interface.define("qookery.IComponent", {

	statics: {

		// Attribute names

		/** {String} Symbolic name of component, unique within its containing form */
		A_ID: "{http://www.qookery.org/ns/Form}id",

		/** {Map} Mapping of prefixes to namespace URIs to associate with component, set by parser after instantiation */
		A_NAMESPACES: "{http://www.qookery.org/ns/Form}namespaces"
	},

	properties: {

		/** Whether the component is enabled */
		enabled: { init: true, check: "Boolean" },

		/** Whether the component is visible */
		visibility: { init: "visible", check : [ "visible", "hidden", "excluded" ] }
	},

	members: {

		// Metadata

		/**
		 * Return the component identifier, if any
		 *
		 * <p>This identifier is guaranteed to be unique within the defining XML document</p>
		 *
		 * @return {String} unique identifier or <code>null</code>
		 */
		getId: function() { },

		/**
		 * Return the type of an attribute
		 *
		 * @param attributeName {String} name of the attribute
		 *
		 * @return {String} attribute's type or <code>null</code> if unknown
		 */
		getAttributeType: function(attributeName) { },

		/**
		 * Return an attribute value from the defining XML document
		 *
		 * <p>You may supply the <code>Error</code> build-in object as the defaultValue parameter
		 * in order to request that an exception is thrown when value is missing.</p>
		 *
		 * @param attributeName {String} the name of the wanted attribute
		 * @param defaultValue {any} value to return instead of <code>undefined</code> when attribute is missing
		 *
		 * @return {any} attribute's value or <code>undefined</code> if attribute is missing
		 */
		getAttribute: function(attributeName, defaultValue) { },

		/**
		 * Set an attribute's value
		 *
		 * <p>NB: Few attributes are expected by implementations to be modified this way - be sure
		 * to check component documentation for supported changes.</p>
		 *
		 * @param attributeName {String} the name of the attribute to change
		 * @param value {any} the new attribute value
		 */
		setAttribute: function(attributeName, value) { },

		// Namespaces

		/**
		 * Resolve a URI namespace prefix
		 *
		 * @param prefix {String} the prefix to resolve
		 *
		 * @return {String?} namespace URI or <code>null</code> if prefix is unknown
		 */
		resolveNamespacePrefix: function(prefix) { },

		/**
		 * Resolve a QName
		 *
		 * <p>The result format is "{" + Namespace URI + "}" + local part. If the namespace URI is empty,
		 * only the local part is returned.</p>
		 *
		 * @param qName {String} the QName to resolve
		 *
		 * @return {String} the string representation of the resolved QName
		 */
		resolveQName: function(qName) { },

		// Lifecycle

		/**
		 * Called by the form parser soon after initialization and attribute parsing
		 *
		 * <p>Notice: You must never call this method directly.</p>
		 *
		 * @param attributes {Map} preprocessed attributes found in the defining XML document
		 */
		create: function(attributes) { },

		/**
		 * Called by the parser when an unknown XML element is encountered within a component's declaration
		 *
		 * <p>Notice: You must never call this method directly.</p>
		 *
		 * @param elementName {String} the resolved fully-qualified name of encountered DOM element
		 * @param element {Element} the DOM element that is not understood by parser
		 *
		 * @return {Boolean} <code>true</code> in case the component was able to do something with input
		 */
		parseXmlElement: function(elementName, element) { },

		/**
		 * Called by the parser after creation of the component and all its children
		 *
		 * <p>Notice: You must never call this method directly.</p>
		 *
		 * @param attributes {Map} preprocessed attributes found in the defining XML document
		 */
		setup: function(attributes) { },

		// Access to other components

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

		// Scripting

		/**
		 * Evaluate a Qookery expression within component's scripting context
		 *
		 * @param expression {String} a valid JavaScript expression
		 *
		 * @return {any} the evaluation result
		 */
		evaluateExpression: function(expression) { },

		/**
		 * Execute Qookery scripting code on component
		 *
		 * @param clientCode {String} a valid Qookery script
		 * @param argumentMap {Map} a map to be passed as arguments to the script
		 *
		 * @return {any} the script result
		 */
		executeClientCode: function(clientCode, argumentMap) { },

		// User interface

		/**
		 * Set the focus to this component
		 */
		focus: function() { },

		/**
		 * Return a list of widgets that are handled by this component
		 *
		 * @param filterName {String} if set, one of 'topMost', 'main' to restrict resulting list
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
		 * @param handler {Function} a function to execute when the event is triggered
		 * @param onlyOnce {Boolean} if <code>true</code>, the listener will be removed as soon as it triggered for the first time
		 */
		addEventHandler: function(eventName, handler, onlyOnce) { },

		// Actions

		/**
		 * Check whether the action exist or not.
		 *
		 * @param actionName {String} the name of the action
		 * @return {Boolean} whether the action exists
		 */
		isActionSupported: function(actionName) { },

		/**
		 * Execute an action provided by this component
		 *
		 * <p>It is safe to call this method for undefined actions,
		 * in which case <code>null</code> is returned.</p>
		 *
		 * @param actionName {String} one the actions provided by component
		 * @param varargs {any} any number of arguments that will be passed to action's function
		 *
		 * @return {any} the action's execution result
		 */
		executeAction: function(actionName, varargs) { },

		// Miscellaneous

		/**
		 * Request validation of component state and contents
		 *
		 * <p>NB: Components should not return errors when disabled, hidden or excluded.</p>
		 *
		 * @return {qookery.util.ValidationError} discovered validation error or <code>null</code> if component is valid
		 */
		validate: function() { },

		/**
		 * Return a translated message
		 *
		 * @param messageId {String} the identifier of the wanted message
		 */
		tr: function(messageId) { },

		/**
		 * Add a disposable to the list of objects that will be disposed automatically together with component
		 *
		 * @param disposable {Object} any object that has a <code>dispose</code> property that is a function
		 */
		addToDisposeList: function(disposable) { }
	}
});

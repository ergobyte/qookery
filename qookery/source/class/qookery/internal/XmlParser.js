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
 * The XMLParser will parse the given xml document and deliver 
 * a GUI in the given parent.
 */
qx.Class.define("qookery.internal.XmlParser", {

	extend: qx.core.Object,
	implement: [ qookery.IXmlParser ],

	construct: function() { 
		this.base(arguments);
		this.__connectionBaseUriMap = { };
		this.__formComponent = new qookery.internal.components.FormComponent();
	},

	members: {

		__formComponent: null,
		__connectionBaseUriMap: null,
		
		create: function(xmlDocument, parentComposite, layoutData, callback, callbackContext, callbackOptions, initialModel) {
			if(xmlDocument == null) throw "An XML form must be supplied.";
			if(parentComposite == null) throw "Parent composite must be supplied";
			var elements = qx.dom.Hierarchy.getChildElements(xmlDocument);
			var formElement = elements[0];
			
			// The form component, like all components, must go through all creation phases

			// Phase 1: New instance - done in contructor

			// Phase 2: Creation
			this.__formComponent.create({});
			
			// Phase 3: Children
			this.__parseStatementBlock(formElement, this.__formComponent);
			// Phase 4: Setup
			this.__formComponent.setup();
			
			var widgets = this.__formComponent.listWidgets();
			if(widgets.length != 1) throw "Form component must have exactly one widget";

			// Phase 5: Going live
			parentComposite.add(widgets[0], layoutData);
			
			if(callback != null) 
				qx.lang.Function.bind(callback, callbackContext, this.__formComponent, callbackOptions)();
			
			if(initialModel != null)
				this.__formComponent.setModel(initialModel);

			return this.__formComponent;
		},
		
		/**
		 * register external context like function that will be called form xml forms
		 * @param id {String } the identifier of the context
		 * @param userContext 
		 */
		registerUserContext: function(id, userContext) {
			this.__formComponent.registerUserContext(id, userContext);
		},
		
		getFormComponent: function() {
			return this.__formComponent;
		},

		/**
		 * Private parseStatementBlock
		 * Parse tags and call the appropriate parser to continue
		 *
		 * @param	blockElement	{String} The xml code block
		 * @param	parentComponent	{qookery.internal.components.*}	 The parent where the new component will delivered
		 */
		__parseStatementBlock: function(blockElement, parentComponent) {
			if(!qx.dom.Element.hasChildren(blockElement)) return;
			var children = qx.dom.Hierarchy.getChildElements(blockElement);
			for(var i = 0; i < children.length; i++) {
				var statementElement = children[i];
				var elementName = qx.dom.Node.getName(statementElement);
				if(elementName == 'form' || elementName == 'layout' || elementName =='element')
					this.__parseStatement(statementElement, parentComponent);
				else if(elementName == 'script')
					this.__parseScript(statementElement, parentComponent);
				else if(elementName == 'setup')
					this.__parseSetup(statementElement, parentComponent);
				else if(elementName == 'bind')
					this.__registerConnectionBase(statementElement, parentComponent);
				else
					throw qx.lang.String.format("Encountered unexpected element <%1>", [ elementName ]);
			}
		},

		/**
		 * Private parseStatement
		 * Parse tags and create new instance of the appropriate class to continue
		 * 
		 * @param	statementElement	{String}	The xml code block
		 * @param 	parentComponet	{qookery.internal.components.*}	The parent where the new component will delivered
		 */
		__parseStatement: function(statementElement, parentComponent) { 
			var componentType = qx.xml.Element.getAttributeNS(statementElement, null, "type");
			if(componentType == '') componentType = qx.dom.Node.getName(statementElement);
			if(componentType == "layout"){
				if(qx.xml.Element.getAttributeNS(statementElement, null, "variant") != '')
					componentType = qx.xml.Element.getAttributeNS(statementElement, null, "variant");
				else
					componentType = "composite";
			}
			var className = "qookery.internal.components." + qx.lang.String.firstUp(componentType) + "Component";
			var clazz = qx.Class.getByName(className);
			if(clazz == null) 
				throw qx.lang.String.format("Form references unresolvable component type %1", [ componentType ]);

			// Phase 1.1: New Instance
			var component = new clazz(parentComponent);
			qx.core.Assert.assertNotNull(component.getParent());

			// Phase 1.2: Registration
			var componentId = qx.xml.Element.getAttributeNS(statementElement, null, "id");
			if(componentId != '' && componentId != null) {
				qx.core.Assert.assertNotNull(component.getForm());
				this.__formComponent.registerComponent(component, componentId);
			}
			
			// Phase 2.1: Creation
			var createOptions = { };
			this.__populateCreateOptions(createOptions, statementElement);
			component.create(createOptions);

			// Phase 3: Children
			this.__parseStatementBlock(statementElement, component);
			
			// Phase 4: Setup
			component.setup();
			
			// Phase 2.2 Binding 
			if(createOptions['connect'] != '' && createOptions['connect'] != null) {
				var connectionHandler = qookery.Qookery.getInstance().getConnectionHandler();
				if(connectionHandler == null) throw "Install a connection handler to handle connections in XML forms";
				
				var connectionSpecification = createOptions['connect'];
				connectionHandler.handleConnection(connectionSpecification, component);
			}

			// Phase 5: Going live
			parentComponent.addChild(component);
		},
		
		/**
		 * Populate createOptions with key value pair base on given xml Attributes array
		 * 
		 * @param createOption {Object} Is a null key value pair
		 * @param statementElement {String} Is a statementElement e.g. <layout grabHorizontal="true" ... >
		 */
		__populateCreateOptions: function(createOption, statementElement) {
			// The XML attributes to scan in the statement .
			var xmlAttributes = [
				'id','variant', 'horizontalSpan', 'label', 'grabHorizontal', 'grabVertical',
				'horizontalAlignment', 'numOfColumns', 'connect',
				'widthHint', 'heightHint', 'disabled'
			];

			// The sizeMap for the widthHint and heightHint based on golden ratio
			var sizeMap = {
				"XXS": 28, "XS": 46 , "S": 74, 
				"M": 120, "L": 194, "XL": 314, "XXL": 508
			};
			for(var i=0; i<xmlAttributes.length; i++) {
				if(xmlAttributes[i] == 'widthHint' || xmlAttributes[i] == 'heightHint')
					createOption[xmlAttributes[i]] = sizeMap[qx.lang.String.trim(qx.xml.Element.getAttributeNS(statementElement, null, xmlAttributes[i]))] || null;
				else
					createOption[xmlAttributes[i]] = qx.lang.String.trim(qx.xml.Element.getAttributeNS(statementElement, null, xmlAttributes[i]));
			}
		},

		/**
		 * Populate a component or add a validator on given component
		 * 
		 * @param setupBlock	{String}	The code block with the code to execute e.g. <setup>code</setup>
		 * @param component {qookery.internal.components.*}	The controlComponent to apply the results
		 */
		__parseSetup: function(setupBlock, component) {
			var setupSourceCode = this.__getNodeText(setupBlock);
			if(setupSourceCode == null) throw "Encountered empty <setup> element";
			component.executeClientCode(setupSourceCode);
		},

		/**
		 * Create a script on given component
		 * 
		 * @param observeBlock {String} The code block and the type of the event
		 * @param component {qookery.internal.components.*}	The control Component that the handler will be applied
		 */
		__parseScript: function(observeBlock, component) {
			var eventName = qx.xml.Element.getAttributeNS(observeBlock, null, "event");
			var listenerSourceCode = this.__getNodeText(observeBlock);
			if(listenerSourceCode == null) throw "Encountered empty <script> element";
			component.addEventHandler(eventName, listenerSourceCode);
		},

		__registerConnectionBase: function(connectionElement) {
			var connectionHandler = qookery.Qookery.getInstance().getConnectionHandler();
			if(connectionHandler == null) throw "Install a connection handler to handle connections in XML forms";
			var type = qx.xml.Element.getAttributeNS(connectionElement, null, "type");
			var key = qx.xml.Element.getAttributeNS(connectionElement, null, "key");
			var uri = qx.xml.Element.getAttributeNS(connectionElement, null, "uri");
			var required = qx.xml.Element.getAttributeNS(connectionElement, null, "required");
			
			// Clean up whitespace
			type = qx.lang.String.trim(type);
			key = qx.lang.String.trim(key);
			uri = qx.lang.String.trim(uri);
			required = qx.lang.String.trim(required);
			
			if(type == "connection-prefix" ) {
				connectionHandler.registerNameSpace(key, uri);
			}
			else if(type == "scripting-context") {
				if(required == "true" && !qx.Class.isDefined(uri)) throw "Cannot find User defined context "+ uri +"\n"+ qx.xml.Element.serialize(connectionElement);
				this.registerUserContext(key, qx.Class.getByName(uri));
			}
			else {
				throw type + " is unknown type of binding";
			}
		},
		
		__getNodeText: function(node) {
			var text = qx.dom.Node.getText(node);
			if(text == null) return null;
			if(text.length == 0) return null;
			text = qx.lang.String.trim(text);
			if(text.length == 0) return null;
			return text;
		}
	},

	destruct: function() {
		this.__formComponent = null;
		this.__connectionBaseUriMap = null;
	}
});

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
	
	statics: {
		CREATE_OPTIONS: [
				'id','variant', 'horizontalSpan', 'label', 'grabHorizontal', 'grabVertical',
				'horizontalAlignment', 'numOfColumns', 'connect',
				'widthHint', 'heightHint', 'disabled'
		],
		
		SIZE_MAP: {
				"XXS": 28, "XS": 46 , "S": 74, 
				"M": 120, "L": 194, "XL": 314, "XXL": 508
		}
	},

	construct: function() { 
		this.base(arguments);
		this.__namespaces = { };
		this.__formComponent = new qookery.internal.components.FormComponent();
	},

	members: {

		__formComponent: null,
		__namespaces: null,
		
		create: function(xmlDocument, parentComposite, layoutData, callback, callbackContext, callbackOptions, initialModel) {
			if(xmlDocument == null) throw new Error("An XML form must be supplied.");
			if(parentComposite == null) throw new Error("Parent composite must be supplied");
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
			if(widgets.length != 1) throw new Error("Form component must have exactly one widget");

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
					this.__parseBind(statementElement, parentComponent);
				else
					throw new Error(qx.lang.String.format("Encountered unexpected element <%1>", [ elementName ]));
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
				throw new Error(qx.lang.String.format("Form references unresolvable component type %1", [ componentType ]));

			// Phase 1.1: New Instance
			var component = new clazz(parentComponent);

			// Phase 1.2: Registration
			var componentId = this.__getAttribute(statementElement, "id");
			if(componentId)
				this.__formComponent.registerComponent(component, componentId);
			
			// Phase 2: Creation
			var createOptions = this.__parseCreateOptions(statementElement);
			component.create(createOptions);

			// Phase 3: Children
			this.__parseStatementBlock(statementElement, component);
			
			// Phase 4: Setup
			component.setup();
			
			// Phase 5: Connection
			if(createOptions['connect']) {
				var connection = this.__resolveQName(createOptions['connect']);
				var modelProvider = qookery.Qookery.getInstance().getModelProvider();
				if(modelProvider == null) 
					throw new Error("Install a model provider to handle connections in XML forms");
				modelProvider.handleConnection(component, connection[0], connection[1]);
			}

			// Phase 6: Going live
			parentComponent.addChild(component);
		},
		
		/**
		 * Parse create options from a statement element
		 */
		__parseCreateOptions: function(statementElement) {
			var createOptions = { };
			for(var i = 0; i < qookery.internal.XmlParser.CREATE_OPTIONS.length; i++) {
				var attributeName = qookery.internal.XmlParser.CREATE_OPTIONS[i];
				var text = this.__getAttribute(statementElement, attributeName);
				if(!text) continue;
				switch(attributeName) {
				case "widthHint":
				case "heightHint":
					createOptions[attributeName] = qookery.internal.XmlParser.SIZE_MAP[text] || parseInt(text);
					break;
				default:
					createOptions[attributeName] = text;
				}
			}
			return createOptions;
		},

		/**
		 * Populate a component or add a validator on given component
		 * 
		 * @param setupBlock	{String}	The code block with the code to execute e.g. <setup>code</setup>
		 * @param component {qookery.internal.components.*}	The controlComponent to apply the results
		 */
		__parseSetup: function(setupBlock, component) {
			var setupSourceCode = this.__getNodeText(setupBlock);
			if(setupSourceCode == null) 
				throw new Error("Encountered empty <setup> element");
			component.executeClientCode(setupSourceCode);
		},

		/**
		 * Create a script on given component
		 * 
		 * @param scriptElement {String} The code block and the type of the event
		 * @param component {qookery.internal.components.*}	The control Component that the handler will be applied
		 */
		__parseScript: function(scriptElement, component) {
			var eventName = this.__getAttribute(scriptElement, "event");
			var listenerSourceCode = this.__getNodeText(scriptElement);
			if(listenerSourceCode == null) 
				throw new Error("Encountered empty <script> element");
			component.addEventHandler(eventName, listenerSourceCode);
		},

		__parseBind: function(bindElement) {
			var type = this.__getAttribute(bindElement, "type");
			var key = this.__getAttribute(bindElement, "key");
			var uri = this.__getAttribute(bindElement, "uri");
			
			switch(type) {
			case "namespace":
				this.__namespaces[key] = uri;
				break;
			case "scripting-context":
				var required = this.__getAttribute(bindElement, "required");
				if(required == "true" && !qx.Class.isDefined(uri)) 
					throw new Error("Cannot find User defined context "+ uri +"\n"+ qx.xml.Element.serialize(bindElement));
				this.registerUserContext(key, qx.Class.getByName(uri));
				break;
			default:
				throw new Error(qx.lang.String.format("Unknown binding type '%1'", [ type ]));
			}
		},

		__getAttribute: function(element, attributeName) {
			var text = qx.xml.Element.getAttributeNS(element, null, attributeName);
			if(text == null || text.length == 0) return null;
			text = qx.lang.String.trim(text);
			if(text.length == 0) return null;
			return text;
		},
		
		__getNodeText: function(node) {
			var text = qx.dom.Node.getText(node);
			if(text == null || text.length == 0) return null;
			text = qx.lang.String.trim(text);
			if(text.length == 0) return null;
			return text;
		},
		
		__resolveQName: function(qname) {
			var parts = qname.split(":");
			if(parts.length == 1) return qname;
			var prefix = parts[0];
			var localPart = parts[1];
			var namespaceUri = this.__namespaces[prefix];
			if(!namespaceUri) throw new Error(qx.lang.String.format("Unable to resolve unknown namespace prefix '%1'", [ prefix ]));
			return [ namespaceUri, localPart ];
		}
	},

	destruct: function() {
		this.__formComponent = null;
		this.__namespaces = null;
	}
});

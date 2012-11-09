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
 * The FormParser will parse a form XML document to create
 * a fully populated IFormComponent into a container composite
 */
qx.Class.define("qookery.internal.FormParser", {

	extend: qx.core.Object,
	implement: [ qookery.IFormParser ],
	
	statics: {
		COMPONENTS: {
			"button": qookery.internal.components.ButtonComponent,
			"check-box": qookery.internal.components.CheckBoxComponent,
			"composite": qookery.internal.components.CompositeComponent,
			"date-field": qookery.internal.components.DateChooserComponent,
			"form": qookery.internal.components.FormComponent,
			"group-box": qookery.internal.components.GroupComponent,
			"image": qookery.internal.components.ImageComponent,
			"label": qookery.internal.components.LabelComponent,
			"list": qookery.internal.components.ListComponent,
			"password-field": qookery.internal.components.PasswordComponent,
			"radio-group": qookery.internal.components.RadioComponent,
			"select-box": qookery.internal.components.SelectBoxComponent,
			"slider": qookery.internal.components.SliderComponent,
			"spinner": qookery.internal.components.SpinnerComponent,
			"tab-view": qookery.internal.components.TabHolderComponent,
			"tab-view-page": qookery.internal.components.TabPageComponent,
			"table": qookery.internal.components.TableComponent,
			"text-area": qookery.internal.components.TextAreaComponent,
			"text-field": qookery.internal.components.TextComponent
		},
		NAMED_SIZES: {
			"XXS":  28,
			"XS" :  46,
			"S"  :  74,
			"M"  : 120,
			"L"  : 194,
			"XL" : 314,
			"XXL": 508
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
		
		create: function(xmlDocument, parentComposite, layoutData) {
			if(xmlDocument == null) throw new Error("An XML form must be supplied.");
			if(parentComposite == null) throw new Error("Parent composite must be supplied");
			var elements = qx.dom.Hierarchy.getChildElements(xmlDocument);
			var formElement = elements[0];
			
			// The form component, like all components, must go through all creation phases

			// Phase 1: New instance - already done in contructor

			// Phase 2: Creation

			var createOptions = this.__parseCreateOptions(formElement);
			this.__formComponent.create(createOptions);
			
			// Phase 3: Children

			this.__parseStatementBlock(formElement, this.__formComponent);

			// Phase 4: Setup

			this.__formComponent.setup();
			
			// Phase 5: Going live

			var formWidget = this.__formComponent.getMainWidget();
			parentComposite.add(formWidget, layoutData);
			
			return this.__formComponent;
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
				if(qookery.internal.FormParser.COMPONENTS[elementName])
					this.__parseStatement(statementElement, parentComponent);
				else if(elementName == 'script')
					this.__parseScript(statementElement, parentComponent);
				else if(elementName == 'bind')
					this.__parseBind(statementElement, parentComponent);
				else if(elementName == 'parsererror')
					throw new Error(qx.lang.String.format("Parser error in statement block: %1", [ qx.dom.Node.getText(statementElement) ]));
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
			var componentType = qx.dom.Node.getName(statementElement);
			var componentClass = qookery.internal.FormParser.COMPONENTS[componentType];
			if(!componentClass) 
				throw new Error(qx.lang.String.format("Form references unresolvable component type %1", [ componentType ]));

			// Phase 1: New Instance

			var component = new componentClass(parentComponent);
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
			if(createOptions['connect']) {
				var connection = this.__resolveQName(createOptions['connect']);
				var modelProvider = qookery.Qookery.getInstance().getModelProvider();
				if(modelProvider == null) 
					throw new Error("Install a model provider to handle connections in XML forms");
				modelProvider.handleConnection(component, connection[0], connection[1]);
			}

			// Phase 5: Going live

			parentComponent.addChild(component);
		},
		
		/**
		 * Parse create options from a statement element
		 */
		__parseCreateOptions: function(statementElement) {
			var createOptions = { };
			var attributes = statementElement.attributes;
			for(var i = 0; i < attributes.length; i++) {
				var attribute = attributes.item(i);
				var key = attribute.nodeName;
				var text = attribute.nodeValue;
				if(text == null || text.length == 0) continue;
				text = qx.lang.String.trim(text);
				if(text.length == 0) continue;
				var value = null;
				switch(key) {
				case "width": 
				case "height":
				case "min-width": 
				case "min-height":
				case "max-width": 
				case "max-height":
					value = qookery.internal.FormParser.NAMED_SIZES[text] || parseInt(text); break;
				case "margin-top": 
				case "margin-right":
				case "margin-bottom": 
				case "margin-left":
				case "padding-top": 
				case "padding-right":
				case "padding-bottom": 
				case "padding-left":
				case "row-span":
				case "column-span":
				case "spacing-x":
				case "spacing-y":
				case "spacing":
					value = parseInt(text); break;
				case "enabled":
				case "stretch-x":
				case "stretch-y":
				case "stretch":
				case "required":
				case "read-only":
					value = text == "true"; break;
				default:
					value = text;
				}
				createOptions[key] = value;
			}
			return createOptions;
		},

		/**
		 * Create a script on given component
		 * 
		 * @param scriptElement {String} The code block and the type of the event
		 * @param component {qookery.internal.components.*}	The control Component that the handler will be applied
		 */
		__parseScript: function(scriptElement, component) {
			var clientCode = this.__getNodeText(scriptElement);
			if(clientCode == null) 
				throw new Error("Encountered empty <script> element");
			var eventName = this.__getAttribute(scriptElement, "event");
			if(eventName)
				component.addEventHandler(eventName, clientCode);
			else
				component.executeClientCode(clientCode);
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
				var clazz = qx.Class.getByName(uri);
				if(clazz) {
					this.__formComponent.registerUserContext(key, clazz);
				}
				else {
					var required = this.__getAttribute(bindElement, "required");
					if(required == "true")
						throw new Error(qx.lang.String.format("Required scripting context %1 missing", [ uri ]));
				}
				break;
			default:
				throw new Error(qx.lang.String.format("Unable to process binding of unknown type '%1'", [ type ]));
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
			if(parts.length == 1) return [ "", qname ];
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

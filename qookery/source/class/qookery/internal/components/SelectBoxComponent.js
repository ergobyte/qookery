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
 * A selectBox that can be populate with complex and simple models.
 */
qx.Class.define("qookery.internal.components.SelectBoxComponent", {

	extend: qookery.internal.components.EditableComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},
	
	members: {
		
		_listController: null,
		_internalModel: null,

		create: function(createOptions) {
			this.base(arguments, createOptions);
			this._listController = new qx.data.controller.List(null, null, null);
		},

		_createMainWidget: function(createOptions) {
			var widget = new qx.ui.form.SelectBox();
			this._setupWidgetAppearance(widget, createOptions);
			return widget;
		},

		connect: function(controller, propertyPath) {
			// TODO WAFFLE protocols should not appear in Qookery. Find way around this travesty!
			controller.addTarget(this._listController, "selection[0]", propertyPath, true);
			controller.addListener("changeModel", function(e) {
				var getterName = "get" + qx.lang.String.firstUp(propertyPath);
				var propertyValue = controller.getModel()[getterName]();
				var protocolName = controller.getModel().getProtocol().getField(propertyPath).getValueProtocol();
				var items = this.getMainWidget().getSelectables(true);
				
				for(var i=0; i<items.length; i++) {
					if(waffle.protocols.SimpleTypes.isEqual(items[i].getModel(), propertyValue, protocolName)) {
						this.getMainWidget().setSelection([items[i]]);
					}
				}
			}, this);
		},

		populate: function(choices) {
			// TODO WAFFLE protocols should not appear in Qookery. Find way around this travesty!
			if(qookery.Qookery.getInstance().getLabelProvider() == null) {
				qx.log.Logger.warn(this, "Please implement a labelPovider or use the function addChoices().");
				return;
			}
			var protocolName = choices[0]["@protocol"];
			var protocol = waffle.protocols.Protocols.getProtocol(protocolName);
			if(protocol == null) {
				qx.log.Logger.warn(this, "Cannot find parameter with protocol name '" + protocolName + "'. Aborting populate().");
				return;
			}
			var labelfield = protocol.getDisplayField().getName();
			var subData = new Array();
			subData.push({ label: "Select a value", data: null });
			for(var i=0; i<choices.length; i++ ) {
				var recreatedLabel = choices[i][labelfield];
				var recreatedData = waffle.protocols.Protocols.createEntity(choices[i], protocolName);
				var recreatedChoice = { label:recreatedLabel, data: recreatedData };
				subData.push(recreatedChoice);
			}
			
			var model = { choices: subData };
			this._internalModel = qx.data.marshal.Json.createModel(model); // there is no problem with sub-objects.
			this.__setDefaultDelegate();
			this._listController.setModel(this._internalModel.getChoices());
			this._listController.setTarget(this.getMainWidget());
		},

		addChoices: function(subData) {
			var model = { choices: subData };
			this._internalModel = qx.data.marshal.Json.createModel(model);
			this.__setDefaultDelegate();
			this._listController.setModel(this._internalModel.getChoices());
			this._listController.setTarget(this.getMainWidget());
		},

		// Methods for internal use

		__setDefaultDelegate: function() {
			this._listController.setDelegate({
				bindItem: function(controller, item, index) {
					controller.bindProperty("label", "label", null, item, index);
					controller.bindProperty("data", "model", null, item, index);
				}
			});
		}
	}
});

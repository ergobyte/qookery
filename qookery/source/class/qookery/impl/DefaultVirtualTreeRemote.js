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

qx.Class.define("qookery.impl.DefaultVirtualTreeRemote", {
	extend: qx.core.Object,
	
	members : {

		bindItem : function(controller, item, id) {
			controller.bindDefaultProperties(item, id);
			controller.bindProperty("size", "size", null, item, id);
			controller.bindProperty("date", "date", null, item, id);
			var remote = {
					converter: function(value, model, source, target) {
						var isOpen = target.isOpen();
						if(isOpen && !value.getLoaded()) {
							value.setLoaded(true);
							var newItems = "resource/qookerydemo/models/virtualTreeItems.json";
							var success = function(data) {
								var node = value.getChildren();
								node.pop();
								node.push(qx.data.marshal.Json.createModel(JSON.parse(data)));
							};
							qookery.contexts.Qookery.loadResource(newItems, null, success);
						}
						return isOpen;
					}
			};
			controller.bindProperty("", "open", remote, item, id);
		},

		createItem : function() {
			return new qookery.impl.DefaultVirtualTreeItem();
		}
	}
});

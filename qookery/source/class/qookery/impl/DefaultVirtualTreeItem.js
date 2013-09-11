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

qx.Class.define("qookery.impl.DefaultVirtualTreeItem", {
	extend : qx.ui.tree.VirtualTreeItem,

	properties : {
		size : { check : "String", event: "changeSize", nullable : true },
		date : { check : "String", event: "changeDate", nullable : true }
	},

	members : {
		__size : null,
		__date : null,

		_addWidgets : function() {
			this.addSpacer();
			this.addOpenButton();
			this.addLabel();
			this.addWidget(new qx.ui.core.Spacer(), {flex: 1});
			// Add a file size, date and mode
			var text = this.__size = new qx.ui.basic.Label();
			this.bind("size", text, "value");
			text.setWidth(50);
			this.addWidget(text);
			text = this.__date = new qx.ui.basic.Label();
			this.bind("date", text, "value");
			text.setWidth(80);
			this.addWidget(text);
		}
	}
});

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

qx.Class.define("qookery.internal.components.GroupComponent", {

	extend: qookery.internal.components.ContainerComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {

		create: function(createOptions) {
			// TODO if numOfColumns is null find a way to caculate the num of childs
			this._numOfColumns = createOptions['numOfColumns'];
			this._layout = new qx.ui.layout.Grid();
			this._layout.setSpacing(10);
			this._grabHorizontal = createOptions['grabHorizontal'] == "true";
			this._widgets[0] = new qx.ui.groupbox.GroupBox(createOptions['label']);
			this._widgets[0].setLayout(this._layout);
			this.base(arguments, createOptions);
		}
	},

	destruct: function(){
		
	}
});

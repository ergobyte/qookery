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

qx.Class.define("qookery.ace.internal.AceWidget", {

	extend: qx.ui.core.Widget,

	construct: function(component) {
		this.base(arguments);
		this.__component = component;
		this.addListener("resize", function() {
			qx.event.Timer.once(function() {
				if(this.isDisposed()) return;
				var editor = this.__component.getEditor();
				if(editor == null) return;
				editor.resize();
			}, this, 0);
		}, this);
	},

	members: {

		__component: null,

		_createContentElement: function() {
			// Create a selectable and overflow disabled <div>
			var element = new qx.html.Element("div", {
				overflowX: "hidden",
				overflowY: "hidden"
			});
			element.setSelectable(true);
			return element;
		}
	}
});

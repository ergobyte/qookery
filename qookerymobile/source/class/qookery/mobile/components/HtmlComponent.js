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

qx.Class.define("qookery.mobile.components.HtmlComponent", {

	extend: qookery.internal.components.Component,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {

		_createWidgets: function(attributes) {
			var htmlText = attributes["html"] || null;
			var html = new qx.ui.mobile.embed.Html(htmlText);
			this._applyLayoutAttributes(html, attributes);
			return [ html ];
		},

		getHtml: function() {
			return this.getMainWidget().getHtml();
		},

		setHtml: function(html) {
			this.getMainWidget().setHtml(html);
		},

		getOverflowY: function() {
			return this.getDomElement().style.overflow;
		},

		setOverflowY: function(overflow) {
			this.getDomElement().style.overflow = overflow;
		},

		getDomElement: function() {
			return this.getMainWidget().getContainerElement();
		}
	}
});

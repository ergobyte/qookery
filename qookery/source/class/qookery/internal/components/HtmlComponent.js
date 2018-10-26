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

qx.Class.define("qookery.internal.components.HtmlComponent", {

	extend: qookery.internal.components.Component,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {

		_createWidgets: function() {
			var html = new qx.ui.embed.Html(this.getAttribute("html", null));
			this._applyAttribute("overflow-x", html, "overflowX");
			this._applyAttribute("overflow-y", html, "overflowY");
			this._applyAttribute("css-class", html, "cssClass");
			this._applyWidgetAttributes(html);
			return [ html ];
		},

		parseXmlElement: function(elementName, xmlElement) {
			if(elementName.indexOf("{http://www.w3.org/1999/xhtml}") !== 0) return false;
			var html = qx.xml.Element.serialize(xmlElement);
			this.setHtml(html);
			return true;
		},

		getHtml: function() {
			return this.getMainWidget().getHtml();
		},

		setHtml: function(html) {
			this.getMainWidget().setHtml(html);
		},

		getDomElement: function() {
			return this.getMainWidget().getContentElement().getDomElement();
		},

		updateAppearance: function() {
			this.getMainWidget().updateAppearance();
		}
	}
});

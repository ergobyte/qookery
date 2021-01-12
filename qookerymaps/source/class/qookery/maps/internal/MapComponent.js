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

qx.Class.define("qookery.maps.internal.MapComponent", {

	extend: qookery.internal.components.EditableComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {

		__frame: null,

		// Metadata

		getAttributeType: function(attributeName) {
			switch(attributeName) {
			case "center": return "NumberList";
			case "map-type": return "String";
			case "provider": return "String";
			case "zoom": return "Integer";
			}
			return this.base(arguments, attributeName);
		},

		setAttribute: function(attributeName, value) {
			this.base(arguments, attributeName, value);
			switch(attributeName) {
			case "provider":
				this._updateUI();
				break;
			}
		},

		_createMainWidget: function() {
			var container = new qx.ui.container.Composite(new qx.ui.layout.Grow());
			var frame = this.__frame = new qx.ui.embed.Iframe();
			frame.setNativeContextMenu(true);
			container.add(frame);
			this._applyWidgetAttributes(container);
			return container;
		},

		_updateUI: function(value) {
			if(this.__frame == null)
				return;
			var url = this.__createSourceUrl();
			this.__frame.setSource(url != null ? url : "about:blank");
		},

		__createSourceUrl: function() {
			var location = this.getValue();
			if(location == null)
				return null;
			var provider = this.getAttribute("provider", "google");
			var url = "";
			switch(provider) {
			case "google":
				url = "https://www.google.com/maps/embed/v1/place?key=";
				var apiKey = qookery.Qookery.getOption(qookery.maps.Bootstrap.OPTIONS_GOOGLE_API_KEY);
				url += apiKey;
				url += "&q=" + location.read("y") + "," + location.read("x");
				url += "&zoom=" + this.getAttribute("zoom", "6");
				url += "&maptype=" + this.getAttribute("map-type", "roadmap");
				break;
			}
			return url;
		}
	}
});

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

/**
 * @ignore(google.*)
 */
qx.Class.define("qookery.maps.internal.MapLocationComponent", {

	extend: qookery.internal.components.EditableComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	events: {
		"changeZoom": "qx.event.type.Data",
		"changeCenter": "qx.event.type.Data",
		"clickMarker": "qx.event.type.Event",
		"ready": "qx.event.type.Event"
	},

	members: {

		__map: null,
		__marker: null,
		__popup: null,
		__closeTimeoutId: null,
		__toolbarButtonDescriptors: null,

		// Metadata

		getAttributeType: function(attributeName) {
			switch(attributeName) {
			case "center": return "NumberList";
			case "map-type": return "String";
			case "zoom": return "Integer";
			case "disable-toolbar": return "Boolean";
			case "allow-maximize": return "Boolean";
			case "allow-paste": return "Boolean";
			case "draggable-marker": return "Boolean";
			}
			return this.base(arguments, attributeName);
		},

		setAttribute: function(attributeName, value) {
			switch(attributeName) {
			case "center":
				if(this.__map != null)
					this.__map.setCenter(new google.maps.LatLng(value[0], value[1]));
				return this._getAttributes()[attributeName] = value;
			case "zoom":
				if(this.__map != null)
					this.__map.setZoom(value);
				return this._getAttributes()[attributeName] = value;
			}
			return this.base(arguments, attributeName, value);
		},

		// Construction

		_createMainWidget: function(attributes) {
			var widget = new qx.ui.core.Widget();
			widget.setAppearance("maplocation");
			widget.setFocusable(true);
			widget.setKeepFocus(false);
			widget.setCursor("pointer");

			widget.addListener("focus", this.__openPopup, this);
			widget.addListener("mousemove", this.__openPopup, this);
			widget.addListener("mouseout", this.__closePopup, this);

			widget.addListener("keypress", function(event) {
				if(event.isCtrlPressed()) return;
				var keyIdentifier = event.getKeyIdentifier();
				switch(keyIdentifier) {
				case "Backspace":
				case "Delete":
					this.setValue(null);
					event.preventDefault();
					break;
				}
			}, this);
			widget.addListenerOnce("appear", function() {
				qookery.Qookery.getRegistry().loadLibrary("googleMaps", this.__onLibraryLoaded, this);
			}, this);
			this._applyLayoutAttributes(widget, attributes);
			return widget;
		},

		// Component implementation

		_updateUI: function(value) {
			if(!this.__map) return;
			var location = this.getValue();
			if(location) {
				this.__setMarkerPosition(location);
			}
			else {
				this.__destroyMarker();
			}
		},

		// Public methods

		getMap: function() {
			return this.__map;
		},

		setCenter: function(lat, lng) {
			this.setAttribute("center", [ lat, lng ]);
		},

		setZoom: function(zoom) {
			this.setAttribute("zoom", zoom);
		},

		// Internals

		__onLibraryLoaded: function(error) {
			if(error != null) {
				this.error("Error loading library", error);
				return;
			}
			var widget = this.getMainWidget();
			if(widget.isDisposed()) return;

			var map = this.__map = new google.maps.Map(widget.getContentElement().getDomElement(), {
				mapTypeId: this.getAttribute("map-type", "roadmap"),
				zoom: this.getAttribute("zoom", qookery.Qookery.getOption(qookery.maps.Bootstrap.OPTIONS_DEFAULT_ZOOM, 6))
			});
			var value = this.getValue();
			if(value != null) {
				map.setCenter(this.__valueToLatLng(value));
			}
			else {
				var centerAttribute = this.getAttribute("center");
				if(centerAttribute == null)
					centerAttribute = qookery.Qookery.getOption(qookery.maps.Bootstrap.OPTIONS_DEFAULT_CENTER, [ 0, 0 ]);
				map.setCenter(new google.maps.LatLng(centerAttribute[0], centerAttribute[1]));
			}
			this._updateUI(this.getValue());

			widget.addListener("resize", function() {
				qx.html.Element.flush();
				google.maps.event.trigger(map, "resize");
			});

			map.addListener("click", function(event) {
				this.focus();
				if(this.isReadOnly()) return;
				if(this.getAttribute("draggable-marker", false) && this.getValue() != null) return;
				var value = this.__latLngToValue(event.latLng);
				this.setValue(value);
			}.bind(this));

			map.addListener("center_changed", function(event) {
				var data = {
					x: map.getCenter().lng(),
					y: map.getCenter().lat()
				};
				this.fireDataEvent("changeCenter", data);
			}.bind(this));

			map.addListener("zoom_changed", function() {
				this.fireDataEvent("changeZoom", map.getZoom());
			}.bind(this));

			this.fireEvent("ready");
		},

		__setMarkerPosition: function(location) {
			var latLng = this.__valueToLatLng(location);
			this.__map.setCenter(latLng);
			if(this.__marker != null) {
				this.__marker.setPosition(latLng);
				return;
			}
			var isReadOnly = this.isReadOnly();
			this.__marker = new google.maps.Marker({
				map: this.__map,
				draggable: !isReadOnly,
				position: latLng
			});
			this.__marker.addListener("dragend", function(event) {
				if(this.isReadOnly()) return;
				var value = this.__latLngToValue(event.latLng);
				this._setValueSilently(value);
				this.__openPopup();
			}.bind(this));
			this.__marker.addListener("click", function(event) {
				this.fireEvent("clickMarker");
			}.bind(this));
		},

		__destroyMarker: function() {
			if(!this.__marker) return;
			this.__marker.setMap(null);
			this.__marker = null;
		},

		__latLngToValue: function(latLng) {
			var coordinates = {
				latitude: latLng.lat(),
				longitude: latLng.lng()
			};
			var modelProvider = this.getForm().getModelProvider();
			return modelProvider.convertFrom(coordinates, "Coordinates");
		},

		__valueToLatLng: function(value) {
			var modelProvider = this.getForm().getModelProvider();
			var coordinates = modelProvider.convertTo(value, "Coordinates");
			return new google.maps.LatLng(coordinates.latitude, coordinates.longitude);
		},

		// Popup

		__openPopup: function() {
			if(this.getAttribute("disable-toolbar")) return;

			if(!this.getValue()) return;
			if(!this.__popup) this.__popup = this.__createPopup();
			if(this.__popup && this.__popup.getVisibility() == "visible") return;

			var mainWidget = this.getMainWidget();
			this.__popup.placeToWidget(mainWidget);
			this.__popup.show();
		},

		__closePopup: function() {
			if(this.getAttribute("disable-toolbar")) return;

			if(this.__closeTimeoutId) {
				clearTimeout(this.__closeTimeoutId);
			}

			this.__closeTimeoutId = qx.lang.Function.delay(function() {
				if(this.__popup != null && !this.__popup.isDisposed()) this.__popup.hide();
			}, 200, this);
		},

		__createPopup: function() {
			this.addListener("changeValue", function(event) {
				if(event.getData() == null) this.__popup.hide();
			}, this);

			var layout = new qx.ui.layout.HBox(5);
			var popup = new qx.ui.popup.Popup(layout);
			popup.setAppearance("button-frame");
			popup.setPosition("bottom-right");
			popup.setOffsetTop(2);
			popup.setPadding(2);
			popup.addListener("mouseover", function() {
				if(this.__closeTimeoutId) clearTimeout(this.__closeTimeoutId);
			}, this);

			if(this.getAttribute("allow-maximize", false) && this.isActionSupported("maximize")) {
				var fullScreenButton = new qx.ui.toolbar.Button("Μεγιστοποίηση", "waffle/icons/material-18/ic_fullscreen_grey600_18dp.png");
				fullScreenButton.setAppearance("tool-button");
				fullScreenButton.addListener("execute", function() {
					this.__popup.hide();
					this.executeAction("maximize");
				}, this);
				popup.add(fullScreenButton);
			}

			if(this.getAttribute("allow-edit", false) && this.isActionSupported("edit")) {
				var pasteButton = new qx.ui.toolbar.Button("Επεξεργασία", "waffle/icons/material-18/ic_create_grey600_18dp.png");
				pasteButton.setAppearance("tool-button");
				pasteButton.addListener("execute", function() {
					this.__popup.hide();
					this.executeAction("edit");
				}, this);
				popup.add(pasteButton);
			}

			var deleteButton = new qx.ui.toolbar.Button("Διαγραφή", "waffle/icons/material-18/ic_clear_all_grey600_18dp.png");
			deleteButton.setAppearance("tool-button");
			deleteButton.addListener("execute", function() {
				this.setValue(null);
			}, this);
			popup.add(deleteButton);

			return popup;
		}
	},

	destruct: function() {
		if(this.__popup) qx.event.Timer.once(function() { this.destroy(); }, this.__popup, 0);
		this.__destroyMarker();
	}
});

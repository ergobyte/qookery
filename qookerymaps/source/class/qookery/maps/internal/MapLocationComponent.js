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
		"ready": "qx.event.type.Event"
	},

	members: {

		__map: null,
		__marker: null,

		// Metadata

		getAttributeType: function(attributeName) {
			switch(attributeName) {
			case "center": return "NumberList";
			case "map-type": return "String";
			case "zoom": return "Integer";
			}
			return this.base(arguments, attributeName);
		},

		// Construction

		_createMainWidget: function(attributes) {
			var widget = new qx.ui.core.Widget();
			widget.addListenerOnce("appear", function() {
				qookery.Qookery.getRegistry().loadLibrary("googleMaps", this.__createMap, this);
			}, this);
			this._applyLayoutAttributes(widget, attributes);
			return widget;
		},

		// Component implementation

		_updateUI: function(value) {
			if(!this.__map) return;
			var location = this.getValue();
			if(location)
				this.__setMarkerPosition(location);
			else
				this.__destroyMarker();
		},

		// Public methods

		getMap: function() {
			return this.__map;
		},

		setCenter: function(lat, lng) {
			this.__map.setCenter(new google.maps.LatLng(lat, lng));
		},

		setZoom: function(zoom) {
			this.__map.setZoom(zoom);
		},

		// Internals

		__createMap: function() {
			var widget = this.getMainWidget();
			if(widget.isDisposed()) return;

			var map = this.__map = new google.maps.Map(widget.getContentElement().getDomElement(), {
				mapTypeId: this.getAttribute("map-type", "roadmap"),
				zoom: this.getAttribute("zoom", 6)
			});

			var centerAttribute = this.getAttribute("center");
			if(centerAttribute)
				map.setCenter(new google.maps.LatLng(centerAttribute[0], centerAttribute[1]));

			var value = this.getValue();
			if(value)
				map.setCenter(this.__valueToLatLng(value));

			this._updateUI(this.getValue());

			widget.addListener("resize", function() {
				qx.html.Element.flush();
				google.maps.event.trigger(map, "resize");
			});

			map.addListener("click", function(event) {
				var data = {
					x: event.latLng.lng().toFixed(6),
					y: event.latLng.lat().toFixed(6)
				};
				this.fireDataEvent("tap", data);
				if(this.isReadOnly()) return;
				var value = this.__latLngToValue(event.latLng);
				this.setValue(value);
			}.bind(this));

			map.addListener("center_changed", function(event) {
				var data = {
					x: map.getCenter().lng().toFixed(6),
					y: map.getCenter().lat().toFixed(6)
				};
				this.fireDataEvent("changeCenter", {
					x: map.getCenter().lng(),
					y: map.getCenter().lat()
				});
			}.bind(this));

			map.addListener("zoom_changed", function() {
				this.fireDataEvent("changeZoom", map.getZoom());
			}.bind(this));

			this.fireEvent("ready");
		},

		__setMarkerPosition: function(location) {
			var latLng = this.__valueToLatLng(location);
			if(this.__marker) {
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
		}
	},

	destruct: function() {
		this.__destroyMarker();
	}
});

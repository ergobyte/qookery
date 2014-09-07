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
 * @asset(qookery/lib/moment/*)
 * @asset(qookery/lib/jquery/*)
 * @asset(qookery/lib/fullcalendar/*)
 *
 * @ignore(jQuery.*)
 */
qx.Class.define("qookery.calendar.internal.CalendarComponent", {

	extend: qookery.internal.components.BaseComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	events: {
		"loaded": "qx.event.type.Event"
	},

	members: {

		__domIdentifier: null,
		__calendar: null,
		__options: null,

		getAttributeType: function(attributeName) {
			switch(attributeName) {
			case "all-day-slot": return "Boolean";
			case "aspect-ratio": return "Number";
			case "editable": return "Boolean";
			case "event-limit": return "Boolean";
			case "first-day": return "Integer";
			case "selectable": return "Boolean";
			default: return this.base(arguments, attributeName); }
		},

		create: function(attributes) {
			this.__domIdentifier = "calendar-" + this.toHashCode();
			this.__options = {
				handleWindowResize: false
			};
			this.base(arguments, attributes);
		},

		_createWidgets: function(attributes) {
			// Create lightest possible widget since we only need a <div>
			var widget = new qx.ui.core.Widget();
			widget.getContentElement().setAttribute("id", this.__domIdentifier);
			// Configure widget positioning by applying layout
			this._applyLayoutAttributes(widget, attributes);
			// Defer creation of fullcalendar until after positioning is done
			widget.addListenerOnce("appear", function(event) {
				qookery.Qookery.getRegistry().loadLibrary("fullcalendar", this.__createCalendar, this);
			}, this);
			widget.addListener("resize", function(event) {
				// Use a timeout to let the layout queue apply its changes to the DOM
				var height = event.getData()["height"];
				qx.event.Timer.once(function() {
					if(!this.__calendar) return;
					this.__calendar.fullCalendar("option", "height", height);
				}, this, 0);
			}, this);
			return [ widget ];
		},

		__createCalendar: function() {
			qx.lang.Object.mergeWith(this.__options, {
				allDaySlot: this.getAttribute("all-day-slot", "true"),
				aspectRatio: this.getAttribute("aspect-ratio", 1.35),
				axisFormat: this.getAttribute("axis-format", "h(:mm)a"),
				defaultDate: this.getAttribute("default-date", undefined),
				editable: this.getAttribute("editable", false),
				eventLimit: this.getAttribute("event-limit", false),
				firstDay: this.getAttribute("first-day", 0),
				header: {
					left: this.getAttribute("header-left", "title"),
					center: this.getAttribute("header-center", ""),
					right: this.getAttribute("header-right", "today prev,next")
				},
				height: this.getMainWidget().getBounds()["height"],
				lang: this.getAttribute("lang", qx.locale.Manager.getInstance().getLanguage()),
				maxTime: this.getAttribute("max-time", "24:00:00"),
				minTime: this.getAttribute("min-time", "00:00:00"),
				scrollTime: this.getAttribute("scroll-time", "06:00:00"),
				selectable: this.getAttribute("selectable", false),
				slotDuration: this.getAttribute("slot-duration", "00:30:00"),
				timeFormat: this.getAttribute("time-format", "h(:mm)t")
			});
			this.__calendar = jQuery("#" + this.__domIdentifier).fullCalendar(this.__options);
			this.fireEvent("loaded");
		},

		addEventHandler: function(eventName, clientCode, onlyOnce) {
			switch(eventName) {
			case "select":
				return this.__options[eventName] = function(start, end, jsEvent, view) {
					this.executeClientCode(clientCode, { "start": start, "end": end, "view": view });
				}.bind(this);
			case "eventClick":
				return this.__options[eventName] = function(calEvent, jsEvent, view) {
					this.executeClientCode(clientCode, { "event": calEvent, "view": view });
				}.bind(this);
			case "eventResize":
			case "eventDrop":
				return this.__options[eventName] = function(calEvent, delta, revertFunc, jsEvent, ui, view) {
					this.executeClientCode(clientCode, { "event": calEvent, "delta": delta, "revertFunc": revertFunc, "view": view });
				}.bind(this);
			}
			this.base(arguments, eventName, clientCode, onlyOnce);
		},

		executeAction: function(actionName, argumentMap) {
			if(this.__calendar) switch(actionName) {
			case "addEventSource": return this.__calendar.fullCalendar("addEventSource", argumentMap["events"]);
			case "refetchEvents": return this.__calendar.fullCalendar("refetchEvents");
			}
			return this.base(arguments, actionName, argumentMap);
		}
	},

	destruct: function() {
		if(this.__calendar) {
			this.__calendar.fullCalendar("destroy");
			this.__calendar = null;
		}
	}
});

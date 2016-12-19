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

	members: {

		__domIdentifier: null,
		__calendar: null,
		__options: null,
		__backgroundOperations: null,
		__backgroundOperationsTimer: null,

		// Metadata

		getAttributeType: function(attributeName) {
			switch(attributeName) {
			case "all-day-slot": return "Boolean";
			case "aspect-ratio": return "Number";
			case "button-text-today": return "ReplaceableString";
			case "button-text-month": return "ReplaceableString";
			case "button-text-week": return "ReplaceableString";
			case "button-text-day": return "ReplaceableString";
			case "default-all-day-event-duration": return "Integer";
			case "default-view": return "ReplaceableString";
			case "editable": return "Boolean";
			case "event-limit": return "Boolean";
			case "first-day": return "Integer";
			case "selectable": return "Boolean";
			default: return this.base(arguments, attributeName); }
		},

		// Construction

		create: function(attributes) {
			this.setAction("refetchEvents", function() { this.__queueOperation("refetchEvents"); });
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
			// Create calendar
			qx.lang.Object.mergeWith(this.__options, {
				allDaySlot: this.getAttribute("all-day-slot", true),
				aspectRatio: this.getAttribute("aspect-ratio", 1.35),
				axisFormat: this.getAttribute("axis-format", "h(:mm)a"),
				buttonText: {
					today: this.getAttribute("button-text-today", undefined),
					month: this.getAttribute("button-text-month", undefined),
					week: this.getAttribute("button-text-week", undefined),
					day: this.getAttribute("button-text-day", undefined)
				},
				defaultAllDayEventDuration: { days: this.getAttribute("default-all-day-event-duration", 1) },
				defaultDate: this.getAttribute("default-date", undefined),
				defaultTimedEventDuration: this.getAttribute("default-timed-event-duration", "02:00:00"),
				defaultView: this.getAttribute("default-view", "month"),
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
				timeFormat: this.getAttribute("time-format", "h(:mm)t"),
				timezone: this.getAttribute("timezone", false)
			});
			this.__calendar = jQuery("#" + this.__domIdentifier).fullCalendar(this.__options);

			// Start background operations
			this.__queueOperation("addEventSource");
		},

		// Component implementation

		addEventHandler: function(eventName, handlerArg, onlyOnce) {
			switch(eventName) {
			case "eventClick":
				return this.__options[eventName] = function(calEvent, jsEvent, view) {
					this.executeClientCode(handlerArg, { "event": calEvent, "view": view });
				}.bind(this);
			case "eventResize":
			case "eventDrop":
				return this.__options[eventName] = function(calEvent, delta, revertFunc, jsEvent, ui, view) {
					this.executeClientCode(handlerArg, { "event": calEvent, "delta": delta, "revertFunc": revertFunc, "view": view });
				}.bind(this);
			case "select":
				return this.__options[eventName] = function(start, end, jsEvent, view) {
					this.executeClientCode(handlerArg, { "start": start, "end": end, "view": view });
				}.bind(this);
			case "viewRender":
				return this.__options[eventName] = function(view, element) {
					this.executeClientCode(handlerArg, { "view": view, "element": element });
				}.bind(this);
			}
			this.base(arguments, eventName, handlerArg, onlyOnce);
		},

		// Public APIs

		getDate: function() {
			return jQuery("#" + this.__domIdentifier).fullCalendar("getDate");
		},

		// Internals

		__isCalendarVisible: function() {
			return jQuery("#" + this.__domIdentifier).is(":visible");
		},

		__queueOperation: function(operationName) {
			if(!this.__backgroundOperations) this.__backgroundOperations = [ ];
			else if(qx.lang.Array.contains(this.__backgroundOperations, operationName)) return;
			this.__backgroundOperations.push(operationName);

			if(this.__backgroundOperationsTimer) return;
			this.__backgroundOperationsTimer = new qx.event.Timer(500);
			this.__backgroundOperationsTimer.addListener("interval", this.__onBackgroundOperationInterval, this);
			this.__backgroundOperationsTimer.start();
		},

		__onBackgroundOperationInterval: function() {
			if(this.__backgroundOperations.length === 0) return;
			if(!this.__isCalendarVisible()) return;
			var operationName = this.__backgroundOperations.shift();
			switch(operationName) {
			case "addEventSource":
				try {
					// Work around a strange bug when fullcalendar is loaded in an invisible DOM element
					this.__calendar.fullCalendar("gotoDate", this.getAttribute("default-date", new Date()));
					this.__calendar.fullCalendar("addEventSource", { events: function(start, end, timezone, callback) {
						this.executeAction("getEvents", start, end, timezone, callback);
					}.bind(this) });
				}
				catch(e) {
					this.warn("Error adding event source to calendar", e);
				}
				return;
			case "refetchEvents":
				this.__calendar.fullCalendar("refetchEvents");
				return;
			}
		}
	},

	destruct: function() {
		if(this.__calendar) {
			this.__calendar.fullCalendar("destroy");
			this.__calendar = null;
		}
		this._disposeObjects("__backgroundOperationsTimer");
	}
});

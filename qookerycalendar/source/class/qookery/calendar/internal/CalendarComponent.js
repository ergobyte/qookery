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
 * @asset(qookery/lib/fullcalendar/*)
 *
 * @ignore(FullCalendar.*)
 */
qx.Class.define("qookery.calendar.internal.CalendarComponent", {

	extend: qookery.internal.components.Component,

	construct(parentComponent) {
		super(parentComponent);
	},

	members: {

		__domIdentifier: null,
		__calendar: null,
		__options: null,
		__backgroundOperations: null,
		__backgroundOperationsTimer: null,
		__widget: null,

		// Metadata

		getAttributeType(attributeName) {
			switch(attributeName) {
			case "all-day-slot": return "Boolean";
			case "aspect-ratio": return "Number";
			case "button-text-today": return "ReplaceableString";
			case "button-text-month": return "ReplaceableString";
			case "button-text-week": return "ReplaceableString";
			case "button-text-day": return "ReplaceableString";
			case "default-all-day-event-duration": return "Integer";
			case "initial-view": return "ReplaceableString";
			case "editable": return "Boolean";
			case "day-max-event-rows": return "Boolean";
			case "first-day": return "Integer";
			case "selectable": return "Boolean";
			default: return super(attributeName);
			}
		},

		// Construction

		create(attributes) {
			this.setAction("refetchEvents", () => { this.__queueOperation("refetchEvents"); });
			this.__domIdentifier = "calendar-" + this.toHashCode();
			this.__options = {
				handleWindowResize: false
			};
			super(attributes);
		},

		_createWidgets() {
			// Create lightest possible widget since we only need a <div>
			let widget = this.__widget = new qx.ui.core.Widget();
			widget.getContentElement().setAttribute("id", this.__domIdentifier);
			// Configure widget positioning by applying layout
			this._applyWidgetAttributes(widget);
			// Defer creation of fullcalendar until after positioning is done
			widget.addListenerOnce("appear", event => {
				qookery.Qookery.getRegistry().loadLibrary("fullcalendar", this.__onLibraryLoaded, this);
			});
			widget.addListener("resize", event => {
				// Use a timeout to let the layout queue apply its changes to the DOM
				let height = event.getData()["height"];
				qx.event.Timer.once(() => {
					if(this.__calendar == null)
						return;
					this.__calendar.setOption("height", height);
					this.__calendar.updateSize();
				}, this, 0);
			});
			return [ widget ];
		},

		__onLibraryLoaded(error) {
			if(error != null) {
				this.error("Error loading library", error);
				return;
			}
			// Create calendar
			qx.lang.Object.mergeWith(this.__options, {
				allDaySlot: this.getAttribute("all-day-slot", true),
				aspectRatio: this.getAttribute("aspect-ratio", 1.35),
				buttonText: {
					today: this.getAttribute("button-text-today", "today")?.toString(),
					month: this.getAttribute("button-text-month", undefined)?.toString(),
					week: this.getAttribute("button-text-week", undefined)?.toString(),
					day: this.getAttribute("button-text-day", undefined)?.toString()
				},
				dayMaxEventRows: this.getAttribute("day-max-event-rows", false),
				defaultAllDayEventDuration: { days: this.getAttribute("default-all-day-event-duration", 1) },
				defaultTimedEventDuration: this.getAttribute("default-timed-event-duration", "02:00:00"),
				editable: this.getAttribute("editable", false),
				eventTimeFormat: this.getAttribute("event-time-format", "h:mm a"),
				firstDay: this.getAttribute("first-day", 0),
				headerToolbar: {
					left: this.getAttribute("header-left", "title"),
					center: this.getAttribute("header-center", ""),
					right: this.getAttribute("header-right", "today prev,next")
				},
				height: this.getMainWidget().getBounds()["height"],
				initialDate: this.getAttribute("initial-date", undefined),
				initialView: this.getAttribute("initial-view", "dayGridMonth"),
				locale: this.getAttribute("locale", qx.locale.Manager.getInstance().getLanguage()),
				scrollTime: this.getAttribute("scroll-time", "06:00:00"),
				selectable: this.getAttribute("selectable", false),
				slotDuration: this.getAttribute("slot-duration", "00:30:00"),
				slotLabelFormat: this.getAttribute("slot-label-format", "h:mm a"),
				slotLabelInterval: "01:00",
				slotMaxTime: this.getAttribute("slot-max-time", "24:00:00"),
				slotMinTime: this.getAttribute("slot-min-time", "00:00:00"),
				snapDuration: this.getAttribute("snap-duration", "00:10:00"),
				timeZone: this.getAttribute("time-zone", "local"),
				views: {
					"timeGridWeek": {
						dayHeaderFormat: { weekday: "short", month: "2-digit", day: "numeric", omitCommas: true }
					}
				}
			});

			// Below hack is to ensure that the FC popup is properly displayed when positioned outside the bounds of the widget
			let domElement = this.__widget.getContentElement().getDomElement();
			qx.bom.element.Style.set(domElement, "overflow", "visible");
			qx.bom.element.Style.set(domElement, "z-index", 11);

			let calendar = this.__calendar = new FullCalendar.Calendar(domElement, this.__options);
			calendar.render();

			// Start background operations
			this.__queueOperation("addEventSource");
		},

		// Component implementation

		addEventHandler(eventName, handler, onlyOnce) {
			switch(eventName) {
			case "eventClick":
			case "eventResize":
			case "eventDrop":
			case "select":
			case "datesSet":
				return this.__options[eventName] = handler;
			}
			super(eventName, handler, onlyOnce);
		},

		// Public APIs

		getDate() {
			return this.__calendar != null ?
				this.__calendar.getDate() :
				moment(this.getAttribute("initial-date", new Date()));
		},

		setDate(date) {
			if(this.__calendar == null)
				return;
			let state = this.__calendar.getCurrentData();
			this.__calendar.dispatch({
				type: "CHANGE_DATE",
				dateMarker: state.dateEnv.createMarker(date)
			});
		},

		getView() {
			return this.__calendar?.view;
		},

		// Internals

		__isCalendarSeeable() {
			return this.getMainWidget().isSeeable();
		},

		__queueOperation(operationName) {
			if(!this.__backgroundOperations)
				this.__backgroundOperations = [ ];
			else if(qx.lang.Array.contains(this.__backgroundOperations, operationName))
				return;
			this.__backgroundOperations.push(operationName);

			if(this.__backgroundOperationsTimer)
				return;
			this.__backgroundOperationsTimer = new qx.event.Timer(500);
			this.__backgroundOperationsTimer.addListener("interval", this.__onBackgroundOperationInterval, this);
			this.__backgroundOperationsTimer.start();
		},

		__onBackgroundOperationInterval() {
			if(this.__backgroundOperations.length === 0)
				return;
			if(!this.__isCalendarSeeable())
				return;
			let operationName = this.__backgroundOperations.shift();
			switch(operationName) {
			case "addEventSource":
				try {
					// Work around a strange bug when fullcalendar is loaded in an invisible DOM element
					this.setDate(this.getAttribute("initial-date", new Date()));
					this.__calendar.addEventSource((info, successCallback, failureCallback) => {
						this.executeAction("getEvents", info, successCallback, failureCallback);
					});
				}
				catch(e) {
					this.warn("Error adding event source to calendar", e);
				}
				return;
			case "refetchEvents":
				if(this.__calendar != null)
					this.__calendar.refetchEvents();
				return;
			}
		}
	},

	destruct() {
		if(this.__calendar != null) {
			this.__calendar.destroy();
			this.__calendar = null;
		}
		this._disposeObjects("__backgroundOperationsTimer");
	}
});

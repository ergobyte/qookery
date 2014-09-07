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
 * @ignore(jQuery.*)
 */
qx.Bootstrap.define("qookery.calendar.Bootstrap", {

	defer: function() {
		var registry = qookery.Qookery.getRegistry();

		registry.registerLibrary("jquery", [ "qookery/lib/jquery/jquery.min.js" ], null, function() { jQuery.noConflict(); });
		registry.registerLibrary("moment", [ "qookery/lib/moment/moment.min.js" ]);
		registry.registerLibrary("fullcalendar", [
			"qookery/lib/fullcalendar/fullcalendar.min.css",
			"qookery/lib/fullcalendar/fullcalendar.min.js",
			"qookery/lib/fullcalendar/lang/el.js"
		], [ "moment", "jquery" ]);

		registry.registerComponentType("q-cal:calendar", qookery.calendar.internal.CalendarComponent);
	}
});

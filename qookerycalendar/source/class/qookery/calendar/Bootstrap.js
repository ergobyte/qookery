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

qx.Bootstrap.define("qookery.calendar.Bootstrap", {

	defer() {
		let registry = qookery.Qookery.getRegistry();

		registry.registerLibrary("moment", [ "${q:external-libraries}/moment/moment.min.js" ]);
		registry.registerLibrary("fullcalendar", [
			"${q:external-libraries}/fullcalendar/index.global.min.js",
			"${q:external-libraries}/fullcalendar/moment-to-fullcalendar.min.js",
			"${q:external-libraries}/fullcalendar/el.global.min.js"
		], [ "moment" ]);

		registry.registerComponentType("{http://www.qookery.org/ns/Form/Calendar}calendar", qookery.calendar.internal.CalendarComponent);
	}
});

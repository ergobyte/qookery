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

qx.Class.define("qookery.internal.components.ProgressBarComponent", {

	extend: qookery.internal.components.Component,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {

		// Metadata

		getAttributeType: function(attributeName) {
			switch(attributeName) {
			case "maximum": return "Number";
			}
			return this.base(arguments, attributeName);
		},

		// Creation

		_createWidgets: function() {
			var progressBar = new qx.ui.indicator.ProgressBar();
			this._applyAttribute("maximum", progressBar, "maximum");
			this._applyWidgetAttributes(progressBar);
			return [ progressBar ];
		},

		// Public methods

		getMaximum: function() {
			return this.getMainWidget().getMaximum();
		},

		setMaximum: function(maximum) {
			this.getMainWidget().setMaximum(maximum);
		},

		getValue: function() {
			return this.getMainWidget().getValue();
		},

		setValue: function(value) {
			return this.getMainWidget().setValue(value);
		}
	}
});

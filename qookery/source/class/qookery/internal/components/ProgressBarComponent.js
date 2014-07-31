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

	extend: qookery.internal.components.BaseComponent,

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

		_createWidgets: function(attributes) {
			var progressBar = new qx.ui.indicator.ProgressBar();
			progressBar.setMaximum(this.getAttribute("maximum", 100));
			this._applyLayoutAttributes(progressBar, attributes);
			return [ progressBar ];
		},

		// Public methods

		getMaximun: function() {
			return this.getMainWidget().getMaximum();
		},

		setMaximun: function(maximim) {
			this.getMainWidget().setMaximum(maximim);
		},

		getValue: function() {
			return this.getMainWidget().getValue();
		},

		setValue: function(value) {
			return this.getMainWidget().setValue(value);
		}
	}
});

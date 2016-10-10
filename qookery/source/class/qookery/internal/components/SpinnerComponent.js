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

qx.Class.define("qookery.internal.components.SpinnerComponent", {

	extend: qookery.internal.components.EditableComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {

		// Metadata

		getAttributeType: function(attributeName) {
			switch(attributeName) {
			case "content-padding": return "IntegerList";
			case "content-padding-bottom": return "Integer";
			case "content-padding-left": return "Integer";
			case "content-padding-right": return "Integer";
			case "content-padding-top": return "Integer";
			}
			return this.base(arguments, attributeName);
		},

		// Construction

		_createMainWidget: function(attributes) {
			var spinner = new qx.ui.form.Spinner();
			this._applyLayoutAttributes(spinner, attributes);
			spinner.setMinimum(this.getAttribute("minimum", 0));
			spinner.setMaximum(this.getAttribute("maximum", 100));
			spinner.setPageStep(this.getAttribute("page-step", 10));
			spinner.setSingleStep(this.getAttribute("single-step", 1));
			spinner.addListener("changeValue", function(event) {
				if(this._disableValueEvents) return;
				var value = event.getData();
				if(value !== null) value = parseInt(value, 10);
				this._setValueSilently(value);
			}, this);
			spinner.getChildControl("textfield").setTextAlign(this.getAttribute("text-align", null));
			if(attributes["content-padding"] !== undefined) spinner.setContentPadding(attributes["content-padding"]);
			if(attributes["content-padding-top"] !== undefined) spinner.setContentPaddingTop(attributes["content-padding-top"]);
			if(attributes["content-padding-right"] !== undefined) spinner.setContentPaddingRight(attributes["content-padding-right"]);
			if(attributes["content-padding-bottom"] !== undefined) spinner.setContentPaddingBottom(attributes["content-padding-bottom"]);
			if(attributes["content-padding-left"] !== undefined) spinner.setContentPaddingLeft(attributes["content-padding-left"]);
			return spinner;
		},

		_updateUI: function(value) {
			if(value === null)
				this.getMainWidget().resetValue();
			else
				this.getMainWidget().setValue(parseInt(value, 10));
		},

		_applyFormat: function(format) {
			this.getMainWidget().setNumberFormat(format);
		}
	}
});

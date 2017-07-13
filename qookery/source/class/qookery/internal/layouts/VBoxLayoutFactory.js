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

qx.Class.define("qookery.internal.layouts.VBoxLayoutFactory", {

	extend: qx.core.Object,
	implement: [ qookery.ILayoutFactory ],
	type: "singleton",

	members: {

		createLayout: function(attributes) {
			var defaultSpacingY = qookery.Qookery.getOption(qookery.Qookery.OPTION_DEFAULT_LAYOUT_SPACING_Y, 0);
			var layout = new qx.ui.layout.VBox(defaultSpacingY);
			var alignX = attributes["layout-align-x"];
			if(alignX != null)
				layout.setAlignX(alignX);
			var alignY = attributes["layout-align-y"];
			if(alignY != null)
				layout.setAlignY(alignY);
			if(attributes["reversed"] != null)
				layout.setReversed(attributes["reversed"]);
			if(attributes["separator"] != null)
				layout.setSeparator(attributes["separator"]);
			var spacing = attributes["spacing"];
			if(spacing != null)
				layout.setSpacing(spacing);
			return layout;
		}
	}
});

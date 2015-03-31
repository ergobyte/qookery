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

qx.Bootstrap.define("qookery.mobile.Bootstrap", {

	defer: function() {

		var registry = qookery.Qookery.getRegistry();
		var components = { };
		components["{http://www.qookery.org/ns/Form/Mobile}button"] = qookery.mobile.components.ButtonComponent;
		components["{http://www.qookery.org/ns/Form/Mobile}composite"] = qookery.mobile.components.CompositeComponent;
		components["{http://www.qookery.org/ns/Form/Mobile}date-field"] = qookery.mobile.components.DateFieldComponent;
		components["{http://www.qookery.org/ns/Form/Mobile}form"] = qookery.mobile.components.FormComponent;
		components["{http://www.qookery.org/ns/Form/Mobile}html"] = qookery.mobile.components.HtmlComponent;
		components["{http://www.qookery.org/ns/Form/Mobile}label"] = qookery.mobile.components.LabelComponent;
		components["{http://www.qookery.org/ns/Form/Mobile}select-box"] = qookery.mobile.components.SelectBoxComponent;
		components["{http://www.qookery.org/ns/Form/Mobile}text-area"] = qookery.mobile.components.TextAreaComponent;
		components["{http://www.qookery.org/ns/Form/Mobile}text-field"] = qookery.mobile.components.TextFieldComponent;

		for(var component in components)
			registry.registerComponentType(component, components[component]);
	}
});

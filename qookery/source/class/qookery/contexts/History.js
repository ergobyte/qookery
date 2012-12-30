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

	$Id$
*/

qx.Class.define("qookery.contexts.History", {

	type: "static",

	statics: {

		getValue: function(name) {
			var state = this.readState();
			if(!state) return null;
			return state[name];
		},

		setValue: function(name, value, title) {
			var state = this.readState() || { };
			state[name] = value;
			this.writeState(state, title);
		},

		readState: function() {
			var fragmentIdentifier = qx.bom.History.getInstance().getState();
			if(!fragmentIdentifier) return null;
			var state = { };
			fragmentIdentifier.replace(/([^~!]+)~([^!]*)/g, function(m, fragmentName, fragmentValue) {
				state[fragmentName] = fragmentValue;
			});
			return state;
		},

		writeState: function(state, title) {
			var fragmentIdentifier = "";
			for(var name in state) {
				if(fragmentIdentifier.length > 0) fragmentIdentifier += "!";
				fragmentIdentifier += name + "~" + state[name];
			}
			var existingFragmentIdentifier = qx.bom.History.getInstance().getState();
			if(fragmentIdentifier == existingFragmentIdentifier) return;
			qx.bom.History.getInstance().addToHistory(fragmentIdentifier, title);
		}
	}
});

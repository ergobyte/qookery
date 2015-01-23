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

qx.Class.define("qookery.internal.util.Connection", {

	extend: Object,

	construct: function(target, targetPropertyPath, sourcePropertyPath) {
		this.__target = target;
		this.__targetPropertyPath = targetPropertyPath;
		this.__sourcePropertyPath = sourcePropertyPath;
	},

	members: {

		__target: null,
		__targetPropertyPath: null,
		__sourcePropertyPath: null,
		__disconnectCallback: null,

		connect: function(source) {
			this.disconnect();
			if(qx.core.ObjectRegistry.inShutDown) return;
			var target = this.__target;
			if(source == null || target == null) return;
			var forwardBindingId = source.bind(this.__sourcePropertyPath, target, this.__targetPropertyPath);
			var reverseBindingId = target.bind(this.__targetPropertyPath, source, this.__sourcePropertyPath);
			this.__disconnectCallback = function() {
				qx.data.SingleValueBinding.removeBindingFromObject(source, forwardBindingId);
				qx.data.SingleValueBinding.removeBindingFromObject(target, reverseBindingId);
			};
		},

		disconnect: function() {
			if(this.__disconnectCallback == null) return;
			this.__disconnectCallback();
			this.__disconnectCallback = null;
		},

		equals: function(connection) {
			return	connection.__target == this.__target &&
					connection.__targetPropertyPath == this.__targetPropertyPath &&
					connection.__sourcePropertyPath == this.__sourcePropertyPath;
		}
	}
});

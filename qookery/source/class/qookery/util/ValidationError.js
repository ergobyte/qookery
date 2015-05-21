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

qx.Class.define("qookery.util.ValidationError", {

	extend: Object,
	include: [ qx.core.MAssert ],

	construct : function(source, message, cause) {
		this.__source = source;
		this.__message = message;
		this.__cause = cause;
	},

	members: {

		__source: null,
		__message: null,
		__cause: null,

		/**
		 * Return the source of this error, if available
		 *
		 * @return {any} a value that represents the source of error, may be <code>null</code>
		 */
		getSource: function() {
			return this.__source;
		},

		/**
		 * Return a message for this error
		 *
		 * @return {String} an error message, may be <code>null</code>
		 */
		getMessage: function() {
			return this.__message;
		},

		/**
		 * Return an array of errors that are the cause of this error
		 *
		 * @return {Array} an array of errors or <code>null</code> if not available
		 */
		getCause: function() {
			return this.__cause;
		},

		/**
		 * Return the computed formatted message which describes this error is more detail
		 *
		 * @return {String} an error message, <code>null</code> is never returned
		 */
		getFormattedMessage: function() {
			var message = this.__message || "";
			if(this.__cause != null) {
				if(message) message += ": ";
				message += this.__cause.map(function(cause) { return cause.getFormattedMessage(); }).join("; ");
			}
			if(!message) message = "Nondescript error";
			return message;
		}
	}
});
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
 * Useful debug capabilities
 */
qx.Class.define("qookery.util.Debug", {

	type: "static",

	statics: {

		/**
		 * Attempt to log a warning about an error that occurred inside a script
		 *
		 * <p>Implementation is browser-specific and can be improved to handle more browsers</p>
		 */
		logScriptError: function(object, sourceCode, error) {
			var stackTraceLines = qx.dev.StackTrace.getStackTraceFromError(error);
			if(stackTraceLines == null) return;
			var lineNumber = null;
			for(var i = 0; i < stackTraceLines.length; i++) {
				var stackTraceLine = stackTraceLines[i];
				var match = stackTraceLine.match(/<anonymous>:([\d]+):([\d+])/);
				if(!match) continue;
				lineNumber = parseInt(match[1]);
				break;
			}
			if(lineNumber == null) return;
			var startIndex = 0;
			for(var i = 3; i < lineNumber; i++) {
				var newLineIndex = sourceCode.indexOf("\n", startIndex);
				if(newLineIndex === -1) break;
				startIndex = newLineIndex + 1;
			}
			qx.log.Logger.warn(object, "Script error at line", match[1], ":", error["message"], "\n\n", sourceCode.substr(startIndex, 250));
		}
	}
});

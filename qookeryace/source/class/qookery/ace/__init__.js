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
 * The Qookery ACE plugin allows to use the ACE editor in qookery forms
 * You will need to download a version of the editor with the required plugins
 * yourself and include it manually into your application.
 *
 * If you are using the javascript compiler, add the following code to your
 * compile.json file:
 *
 * <pre>
 * "include": [
 *   "qookery.*",
 *   "qookery.ace.*"
 *   ...
 * ],
 * "environment": {
 *   "qookery.ace.path": "subdir-of-resource-folder",
 *   ...
 * }
 * </pre>
 *
 * The environment variable "qookery.ace.path" must contain the path to the
 * directory containing the necessary (minified) ACE source files. This directory
 * should be a subdirectory the main library's source/resource/app-namespace
 * folder, since only then will these files be automatically copied to the final
 * build. For example, if the library namespace is foo, and ace.js is placed
 * into source/resource/foo/js/ace, define "qookery.ace.path": "foo/js/ace".
 * The minimal files to get the editor running are "ace.js" and "theme-eclipse.js".
 *
 */

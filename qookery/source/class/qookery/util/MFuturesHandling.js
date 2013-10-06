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
 * Mixin for objects needing to wait on multiple tasks running in parallel
 */
qx.Mixin.define("qookery.util.MFuturesHandling", {

	construct: function() {
		this.__futures = [ ];
	},
	
	events: {

		/**
		 * Event used by completed futures to notify including object
		 */
		"futureFinished": "qx.event.type.Data"
	},

	members: {

		__futures: null,

		/**
		 * Create a new future (parallel task) handle
		 * 
		 * @return {any} new future handle
		 */
		createFuture: function() {
			var future = qx.event.Manager.getNextUniqueId();
			this.__futures.push(future);
			return future;
		},

		/**
		 * Called by future when finished to notify owning object of it completion
		 * 
		 * @param future {any} future handle, as returned by #createFuture()
		 */
		futureFinished: function(future) {
			if(!qx.lang.Array.remove(this.__futures, future)) return;
			this.fireDataEvent("futureFinished", future);
		},

		/**
		 * Register a function to be called once all futures are finished
		 * 
		 * @param callback {Function} the callback to be called
		 * @param thisArg {any} <code>this</code> context for callback
		 */
		onceAllFuturesHaveFinished: function(callback, thisArg) {
			if(this.__futures.length === 0) {
				// No futures are pending, so call and return immediately
				callback.call(thisArg);
				return;
			}
			var listener = null;
			listener = this.addListener("futureFinished", function() {
				if(this.__futures.length > 0) return;
				this.removeListenerById(listener);
				callback.call(thisArg);
			}, this);
		}
	}
});


qx.Mixin.define("qookery.util.MFuturesHandling", {

	construct: function() {
		this.__futures = [ ];
	},
	
	events: {
		"futureFinished": "qx.event.type.Data"
	},

	members: {

		__futures: null,
		
		createFuture: function(title) {
			qx.log.Logger.debug(this, title);
			var future = qx.event.Manager.getNextUniqueId();
			this.__futures.push(future);
			return future;
		},
		
		futureFinished: function(future) {
			if(!qx.lang.Array.remove(this.__futures, future)) return;
			this.fireDataEvent("futureFinished", future);
		},
		
		onceAllFuturesHaveFinished: function(callback, thisArg) {
			if(this.__futures.length === 0) {
				// No futures are pending, so call and return immediately
				callback.bind(thisArg)();
				return;
			}
			var listener = null;
			listener = this.addListener("futureFinished", function() {
				if(this.__futures.length > 0) return;
				this.removeListenerById(listener);
				callback.bind(thisArg)();
			}, this);
		}
	}
});

/*
 *	Copyright (C) Ergobyte Informatics S.A. - All Rights Reserved
 *
 * 	This material is proprietary to Ergobyte. The methods and techniques described herein are considered trade secrets
 *	and/or confidential. Reproduction or distribution, in whole or in part, is forbidden except by express written permission.
 *
 *	$Id$
 */

qx.Class.define("qookery.contexts.MessageBus", {

	type: "static",

	statics: {

		subscribe: function(message, subscriber, context) {
			qx.event.message.Bus.getInstance().subscribe(message, subscriber, context);
		},

		unsubscribe: function(message, subscriber, context) {
			qx.event.message.Bus.getInstance().unsubscribe(message, subscriber, context);
		},

		dispatch: function(name, data) {
			var msg = new qx.event.message.Message(name, data);
			qx.event.message.Bus.getInstance().dispatch(msg);
		}
	}
});

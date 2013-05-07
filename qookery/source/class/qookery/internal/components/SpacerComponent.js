/*
 *	Copyright (C) Ergobyte Informatics S.A. - All Rights Reserved
 *
 * 	This material is proprietary to Ergobyte. The methods and techniques described herein are considered trade secrets
 *	and/or confidential. Reproduction or distribution, in whole or in part, is forbidden except by express written permission.
 *
 *	$Id$
 */

qx.Class.define("qookery.internal.components.SpacerComponent", {

	extend: qookery.internal.components.BaseComponent,

	construct: function(parentComponent) {
		this.base(arguments, parentComponent);
	},

	members: {
		
		create: function(attributes) {
			this._widgets[0] = new qx.ui.core.Spacer();
			this._applyLayoutAttributes(this._widgets[0], attributes);
			this.base(arguments, attributes);
		}
	}
});
/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"eincodes/poc/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});

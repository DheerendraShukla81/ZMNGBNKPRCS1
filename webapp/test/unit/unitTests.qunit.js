/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comokwutmngbnkprcs/zmngbnkprcs/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});

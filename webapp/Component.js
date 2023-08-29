/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "com/okwut/mngbnkprcs/zmngbnkprcs/model/models",
        "sap/ui/model/json/JSONModel"
    ],
    function (UIComponent, Device, models,JSONModel) {
        "use strict";

        return UIComponent.extend("com.okwut.mngbnkprcs.zmngbnkprcs.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");

                var oRootPath = jQuery.sap.getModulePath("ZCHART_DEMO.ZCHART_DEMO"); // your resource root
			
			    var oImageModel = new sap.ui.model.json.JSONModel({
				    path : oRootPath,
			    });
			    sap.ui.getCore().setModel(oImageModel, "imageModel");
			    this.getContentDensityClass();

              /*  var bnkrupcyModel=new sap.ui.model.json.JSONModel();
                bnkrupcyModel.loadData(jQuery.sap.getModulePath("com.okwut.mngbnkprcs.zmngbnkprcs.model", "/bnkData.json"));
                sap.ui.getCore().setModel(bnkrupcyModel, "bnkrupcyModel");*/
            },
            getContentDensityClass: function () {
                if (!this._sContentDensityClass) {
                    if (!sap.ui.Device.support.touch){
                        this._sContentDensityClass = "sapUiSizeCompact";
                    } else {
                        this._sContentDensityClass = "sapUiSizeCozy";
                    }
                }
                return this._sContentDensityClass;
            }
        });
    }
);
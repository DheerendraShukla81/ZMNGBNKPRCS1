sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/Device",
        "sap/ui/model/Sorter",
        "sap/ui/model/Filter",
        "sap/ui/model/json/JSONModel",
        "sap/m/MessageBox",
        "com/okwut/mngbnkprcs/zmngbnkprcs/Commons/MyRequestsPersoService",
        'sap/viz/ui5/data/FlattenedDataset',
        'sap/viz/ui5/format/ChartFormatter',
        'sap/viz/ui5/api/env/Format',
        'sap/viz/ui5/controls/VizTooltip',
        'sap/viz/ui5/controls/VizFrame',
        'sap/viz/ui5/controls/common/feeds/FeedItem',
        'sap/suite/ui/commons/ChartContainer',
        'sap/suite/ui/commons/ChartContainerContent',
        'sap/viz/ui5/controls/Popover',
        "sap/m/TablePersoController",
        "com/okwut/mngbnkprcs/zmngbnkprcs/util/Formatter"
    ], function (Controller, Device, Sorter, Filter, JSONModel, MessageBox, MyRequestsPersoService,FlattenedDataset, ChartFormatter, Format,VizTooltip, VizFrame, FeedItem, ChartContainer, ChartContainerContent, Popover) {
        "use strict";
    
        return Controller.extend("com.okwut.mngbnkprcs.zmngbnkprcs.controller.Overview", {
            onInit: function () { 
                var that = this;
                var pgMode = {
					"isEditable": false
	                };
                var pgModeModel = new sap.ui.model.json.JSONModel();
                pgModeModel .setData({
			            modelData: pgMode 
		             });
                this.getView().setModel(pgModeModel,"pgModeModel");
                
                var i18nModel = new sap.ui.model.resource.ResourceModel({
                    bundleName: "com.okwut.mngbnkprcs.zmngbnkprcs.i18n.i18n" });                  
                    this.getView().setModel(i18nModel,"i18n");


                this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this.oRouter.getRoute("Overview").attachPatternMatched(this._onObjectFetched, this);
                
                this._mViewSettingsDialogs = {};
                
                var mTable = this.getView().byId("bnkRupcyList");
                
                if (!this._oTPC) {
                    try {
                        this._oTPC = new sap.m.TablePersoController({
                            table: mTable,
                            componentName: "demoApp",
                            persoService: MyRequestsPersoService.getPersoService()
                        }).activate();
                    } catch (e) {
                    //console.log(e)
                    }
                }
                
                
                this.loadChart();
            },
            _onObjectFetched: function (oEvent) {
                var that = this;
                this.getView().setModel(this.getOwnerComponent().getModel("bnkrupcyModel"), "bnkrupcyModel");
                this._mViewSettingsDialogs = {};
                //this.getView().setModel(this.getOwnerComponent().getModel("bnkrupcyModel"), "bnkrupcyModel");
            },
            onSettingsCreate: function (oEvent) {
                this._oTPC.openDialog();
            },
            onSortButtonPressed: function () {
                var sortdlg = this.createViewSettingsDialog("com.okwut.mngbnkprcs.zmngbnkprcs.fragments.MyRequestsSortDialog");
                if (this.selectedTabkey === "0") {
                    if (this.sortTyp !== undefined) {
                        sortdlg.setSortDescending(this.sortTyp);
                    }
                    if (this.sortKey !== undefined) {
                        sortdlg.setSelectedSortItem(this.sortKey);
                    }
                } else {
                    if (this.sortTypActive !== undefined) {
                        sortdlg.setSortDescending(this.sortTypActive);
                    }
                    if (this.sortKeyActive !== undefined) {
                        sortdlg.setSelectedSortItem(this.sortKeyActive);
                    }
                }
                sortdlg.open();
            },		
            createViewSettingsDialog: function (sDialogFragmentName) {
                var data = {};
                var oFilterModel = new sap.ui.model.json.JSONModel();
                oFilterModel.setData(data);
    
                var oDialog = this._mViewSettingsDialogs[sDialogFragmentName];
    
                if (!oDialog) {
                    oDialog = sap.ui.xmlfragment(sDialogFragmentName, this);
                    oDialog.setModel(oFilterModel, "filterModel");
                    this._mViewSettingsDialogs[sDialogFragmentName] = oDialog;
    
                    /*	if (Device.system.desktop) {
                            oDialog.addStyleClass("sapUiSizeCompact");
                        }*/
                }
                return oDialog;
            },
            
            handleSortDialogConfirm: function (oEvent) {
                var mTable = this.getView().byId("bnkRupcyList");
    
                var oTable = mTable,
                    mParams = oEvent.getParameters(),
                    oBinding = oTable.getBinding("items"),
                    sPath,
                    bDescending,
                    aSorters = [];
    
                sPath = mParams.sortItem.getKey();
                bDescending = mParams.sortDescending;
                
                this.sortKeyActive = mParams.sortItem.getKey();
                this.sortTypActive = mParams.sortDescending;
                this.sortParamsActive = oEvent.getParameters();
                aSorters.push(new Sorter(sPath, bDescending));
                oBinding.sort(aSorters);
            },
            onExit: function () {
                this._oTPC.destroy();
            },
            handleHdrItemPress: function (oEvent) {
                this.getView().getModel("pgModeModel").setProperty("/modelData/isEditable", false);
                this.getView().byId("btnEdit").setVisible(true);
                this.getView().byId("btnUpdate").setEnabled(false);
                var selectedObj = oEvent.getSource().getBindingContext("bnkrupcyModel").getObject();

                this.getOwnerComponent().getModel("bnkrupcyDetailsModel").setData({
                    modelData: selectedObj
                    });
                
                this.oRouter.navTo("BankrupcyDetails", {
                    "bpNum": selectedObj.BusinessPartner.trim()
                }, true);
            },
            vendorValueHelp: function (oEvent) {
    
                //var VendorName = "Test Vendor";
                //var Vendor = "0111";
                var sdataInv = "{\"VendorName\":\"Test Vendor1\",\"Vendor\":\"0111\"}";
                sdataInv += ",{\"VendorName\":\"Test Vendor2\",\"Vendor\":\"0112\"}";
                sdataInv += ",{\"VendorName\":\"Test Vendor3\",\"Vendor\":\"0113\"}";
                sdataInv += ",{\"VendorName\":\"Test Vendor4\",\"Vendor\":\"0114\"}";
    
                var rootdata = "{" + "\"" + "results" + "\": [" + sdataInv + "]}";
                var jsnObj = JSON.parse(rootdata);
                var VenModel = new sap.ui.model.json.JSONModel();
                VenModel.setData(jsnObj);
                this.getView().setModel(VenModel, "VenModel");
    
                if (!this._oDialog_VEN) {
                    this._oDialog_VEN = sap.ui.xmlfragment(this.getView().getId(), "ZCHART_DEMO.ZCHART_DEMO.fragment.VendorDialog", this);
                    this.getView().addDependent(this._oDialog_VEN);
                }
                var oTable = this.getView().byId("vendortbl");
                this._oDialog_VEN.open();
                this.showModal();
    
            },
            vendorSearch: function (oEvent) {
                var vendorDetails = this.getView().byId("idvendorSearch").getValue();
    
                var vendorFilter = new sap.ui.model.Filter({
                    filters: [
                        new sap.ui.model.Filter("Vendor", sap.ui.model.FilterOperator.Contains, vendorDetails),
                        new sap.ui.model.Filter("VendorName", sap.ui.model.FilterOperator.Contains, vendorDetails)
                    ],
                    and: false
                });
                var oTable = this.getView().byId("vendortbl");
                var Model = this.getView().getModel("VenModel");
    
                oTable.setModel(Model);
                
                var oItems = new sap.m.ColumnListItem({
                    vAlign: sap.ui.core.VerticalAlign.Middle,
                    cells: [
                        new sap.m.Text({
                            text: "{VendorName}"
                        }),
                        new sap.m.Text({
                            text: "{Vendor}"
                        })
                    ]
                });
                oTable.bindItems("/results", oItems, null, vendorFilter);
    
            },
            vendorCancelPressed: function (oEvent) {
                this.getView().byId("idvendorSearch").setValue("");
                this._oDialog_VEN.close();
            },
            getVendor: function (oEvent) {
                var vendorSearchTable = this.getView().byId("vendortbl");
                var oidVendor = this.getView().byId("inputVendor");
    
                var oSelectedVendor = vendorSearchTable.getSelectedItem().mAggregations.cells[0].mProperties.text;
                var oSelectedVendorNumber = vendorSearchTable.getSelectedItem().mAggregations.cells[1].mProperties.text;
                oidVendor.setValue(oSelectedVendorNumber);
    
                this._oDialog_VEN.close();
                this.getView().byId("inputVendor").setValueState(sap.ui.core.ValueState.None);
    
            },
            showModal: function () {
    
                if (!this._dialog) {
                    //this._dialog = sap.ui.xmlfragment("ZCHART_DEMO.ZCHART_DEMO.fragment.BusyDialog", this);
                    this.getView().addDependent(this._dialog);
                }
    
                // open dialog
                jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._dialog);
                this._dialog.open();
    
                // simulate end of operation
                _timeout = jQuery.sap.delayedCall(2000, this, function () {
                    this._dialog.close();
                });
    
            },
    
            hideModal: function (that) {
                jQuery.sap.clearDelayedCall(_timeout);
                that._dialog.close();
            },
            
            loadChart: function(chartType)
            {
                var viewObj = this;
                var json= [{"__metadata":{"id":"https://vhfgfd4hci.sap.fgfbrands.com:44300/sap/opu/odata/sap/ZEAM_MNT_DASHBOARD_SRV/ST_WorkOrd_TypeSet('2023-Quarter4')","uri":"https://vhfgfd4hci.sap.fgfbrands.com:44300/sap/opu/odata/sap/ZEAM_MNT_DASHBOARD_SRV/ST_WorkOrd_TypeSet('2023-Quarter4')","type":"ZEAM_MNT_DASHBOARD_SRV.ST_WorkOrd_Type"},"I_PLANT":"BAR2,FEN1,LOC1,ORM2,WOO1","Quarter":"2023-Quarter4","S_Date":"20221009","E_Date":"20221231","Corrective_WO":"82.35","General_WO":"5.88","Preventive_WO":"11.76"},{"__metadata":{"id":"https://vhfgfd4hci.sap.fgfbrands.com:44300/sap/opu/odata/sap/ZEAM_MNT_DASHBOARD_SRV/ST_WorkOrd_TypeSet('2023-Quarter1')","uri":"https://vhfgfd4hci.sap.fgfbrands.com:44300/sap/opu/odata/sap/ZEAM_MNT_DASHBOARD_SRV/ST_WorkOrd_TypeSet('2023-Quarter1')","type":"ZEAM_MNT_DASHBOARD_SRV.ST_WorkOrd_Type"},"I_PLANT":"","Quarter":"2023-Quarter1","S_Date":"20230101","E_Date":"20230325","Corrective_WO":"95.76","General_WO":"0.00","Preventive_WO":"4.24"},{"__metadata":{"id":"https://vhfgfd4hci.sap.fgfbrands.com:44300/sap/opu/odata/sap/ZEAM_MNT_DASHBOARD_SRV/ST_WorkOrd_TypeSet('2023-Quarter2')","uri":"https://vhfgfd4hci.sap.fgfbrands.com:44300/sap/opu/odata/sap/ZEAM_MNT_DASHBOARD_SRV/ST_WorkOrd_TypeSet('2023-Quarter2')","type":"ZEAM_MNT_DASHBOARD_SRV.ST_WorkOrd_Type"},"I_PLANT":"","Quarter":"2023-Quarter2","S_Date":"20230326","E_Date":"20230617","Corrective_WO":"75.00","General_WO":"5.56","Preventive_WO":"19.44"},{"__metadata":{"id":"https://vhfgfd4hci.sap.fgfbrands.com:44300/sap/opu/odata/sap/ZEAM_MNT_DASHBOARD_SRV/ST_WorkOrd_TypeSet('2023-Quarter3')","uri":"https://vhfgfd4hci.sap.fgfbrands.com:44300/sap/opu/odata/sap/ZEAM_MNT_DASHBOARD_SRV/ST_WorkOrd_TypeSet('2023-Quarter3')","type":"ZEAM_MNT_DASHBOARD_SRV.ST_WorkOrd_Type"},"I_PLANT":"","Quarter":"2023-Quarter3","S_Date":"20230618","E_Date":"20230909","Corrective_WO":"83.33","General_WO":"0.00","Preventive_WO":"16.67"}];
                var rootdata = "{" + "\"" + "results" + "\": " + JSON.stringify(json) + "}";
                var jsnObj = JSON.parse(rootdata);
            
                
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData(jsnObj);
                
                var oVizFrame = viewObj.oVizFrame = viewObj.getView().byId("idVizFrame");
                oVizFrame.setModel(oModel);
    
                var mPlant = viewObj.getMainPlant(oModel.oData);
    
                //=====================Chart Properties ======================================================================================
                Format.numericFormatter(ChartFormatter.getInstance());
                var formatPattern = ChartFormatter.DefaultPattern;
                oVizFrame.setVizProperties({
                    plotArea: {
                        colorPalette: [
                            '#2071b2', '#ffa500', '#cdcd32'
                        ],
                        drawingEffect: 'glossy',
                        dataLabel: {
                            formatString: formatPattern.SHORTFLOAT_MFD2,
                            visible: true,
                            showTotal: false
                        }
                    },
                    valueAxis: {
                        label: {
                            formatString: formatPattern.SHORTFLOAT
                        },
                        title: {
                            text: "Work Type (%)",
                            visible: true
                        },
                        tooltip: {
                            visible: true
                        }
                    },
                    categoryAxis: {
                        title: {
                            visible: false,
                        },
                        tooltip: {
                            visible: true
                        }
                    },
                    tooltip: {
                        visible: true
                    },
                    title: {
                        visible: true,
                        text: 'Work Order & Notification Type (Plant: ' + mPlant + ')'
                    }
    
                });
    
                var oTooltip = new VizTooltip({});
                oTooltip.connect(oVizFrame.getVizUid());
                oTooltip.setFormatString(formatPattern.STANDARDFLOAT);
                var chartFixFlex = viewObj.getView().byId('chartFixFlex');
                viewObj.functionSetFlextContent(oVizFrame, chartFixFlex);
                oVizFrame.setBusy(false);
            },
        
            getMainPlant: function (oData) {
                var arayPlant = [];
                var mPlant = "";
                for (var i = 0; i < oData.results.length; i++) {
                    if (!arayPlant.includes(oData.results[i].I_PLANT)) {
                        if (oData.results[i].I_PLANT !== "")
                            arayPlant.push(oData.results[i].I_PLANT);
                    }
    
                }
                mPlant = arayPlant.join(', ');
                return mPlant;
            },
            functionSetFlextContent: function (oVizFrame, chartFixFlex) {
                var libraries = sap.ui.getVersionInfo().libraries || [];
                var bSuiteAvailable = libraries.some(function (lib) {
                    return lib.name.indexOf("sap.suite.ui.commons") > -1;
                });
                if (bSuiteAvailable) {
                    jQuery.sap.require("sap/suite/ui/commons/ChartContainer");
                    var oChartContainerContent = new sap.suite.ui.commons.ChartContainerContent({
                        icon: "sap-icon://vertical-stacked-chart",
                        title: "",
                        content: [oVizFrame]
                    });
                    var oChartContainer = new sap.suite.ui.commons.ChartContainer({
                        content: [oChartContainerContent]
                    });
    
                    var iconMsettings1 = {
                        src: "sap-icon://along-stacked-chart",
                        tooltip: "Stacked"
                    };
    
                    var iconId = "Stacked" + "-" + new Date().getTime().toString();
                    var oIcon = new sap.ui.core.Icon(iconId, iconMsettings1);
                    var fnNavChart = this.fnNavChart;
                    oIcon.attachPress(fnNavChart, this);
                    oChartContainer.addCustomIcon(oIcon);
                    
                    var iconMsettings2 = {
                        src: "sap-icon://column-chart-dual-axis",
                        tooltip: "Column"
                    };
                    
                    iconId = "Column" + "-" + new Date().getTime().toString();
                    var oIcon = new sap.ui.core.Icon(iconId, iconMsettings2);
                    var fnNavChart = this.fnNavChart;
                    oIcon.attachPress(fnNavChart, this);
                    oChartContainer.addCustomIcon(oIcon);
                    
                    var iconMsettings3 = {
                        src: "sap-icon://bar-chart",
                        tooltip: "Bar"
                    };
                    
                    iconId = "Bar" + "-" + new Date().getTime().toString();
                    var oIcon = new sap.ui.core.Icon(iconId, iconMsettings3);
                    var fnNavChart = this.fnNavChart;
                    oIcon.attachPress(fnNavChart, this);
                    oChartContainer.addCustomIcon(oIcon);
    
                    oChartContainer.setShowFullScreen(true);
                    oChartContainer.setAutoAdjustHeight(true);
                    oChartContainer.setShowZoom(false);
                    chartFixFlex.setFlexContent(oChartContainer);
                }
            },
            fnNavChart: function (oEvent) {
                var ChartId = oEvent.getSource().sId.split("-")[0];
                var router = sap.ui.core.UIComponent.getRouterFor(this);
                    var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
                 if (ChartId === "Stacked") {
                 
                    oVizFrame.vizType ="stacked_column";
                    oVizFrame.setVizType("stacked_column")
                }
                else if (ChartId === "Column") {
                    oVizFrame.setVizType("column")
                }
                else if (ChartId === "Bar") {
                    oVizFrame.setVizType("bar")
                }
            },
            onAddBtnPress: function (oEvent) {
                /*this.methodType = "POST";
                var selectedObj = {
                    Certtypename: "",
                    Cermessage: "I"
                };
    
                var crtTypeModel = new sap.ui.model.json.JSONModel();
                crtTypeModel.setData({
                    modelData: selectedObj
                });
                this.getOwnerComponent().setModel(crtTypeModel, "crtTypeModel");
                this.getOwnerComponent().getModel("crtTypeModel").refresh(true);
                */
                this.openDialog("CreateCaseDialog", "com.okwut.mngbnkprcs.zmngbnkprcs.fragments.NewCaseDialog");
                this.byId("CreateCertificationTypeDialog").setTitle("Create New Case");
    
                /*var cntrlCertificationTypeName = this.getView().getDependents()[0].getContent()[0].getItems()[0].getItems()[1];
            
    
                cntrlCertificationTypeName.addEventDelegate({
                    onfocusout: function (oevt) {
                        if (oevt.srcControl.getValue().trim().length > 0)
                            oevt.srcControl.setValueState(sap.ui.core.ValueState.None);
                    }
                });
                
    
                cntrlCertificationTypeName.setValueState(sap.ui.core.ValueState.None);
                
                this.byId("CreateCertificationTypeDialog").setModel(crtTypeModel, "crtTypeModel");
                */
            },
            openDialog: function (sDialog, sViewName) {
                var oDialog = this.getView().byId(sDialog, sViewName);
                if (!oDialog) {
                    oDialog = new sap.ui.xmlfragment(this.getView().getId(),
                        sViewName, this);
                    this.getView().addDependent(oDialog);
                }
                oDialog.open();
                return oDialog;
            },
            onCancelDialog: function (oEvent) {
                //this._loadMngAdminTblData();
                this.closeDialog("CreateCaseDialog");
    
            },
            closeDialog: function (dialog) {
                if (typeof dialog === "string") {
                    this.getView().byId(dialog).close();
                } else if (typeof dialog === "object") {
                    dialog.close();
                }
            },
            onEditBtnPress: function (OEvent) {
                OEvent.getSource().setVisible(false);
                this.getView().getModel("pgModeModel").setProperty("/modelData/isEditable", true);
            },
            onCancelBtnPress: function (OEvent) {
                this.getView().getModel("pgModeModel").setProperty("/modelData/isEditable", false);
                this.getView().byId("btnEdit").setVisible(true);
            },
            onSelectionChange:function (OEvent){
                if(OEvent.getSource().getSelectedItems().length>0){
                    this.getView().byId("btnUpdate").setEnabled(true);
                }else{
                    this.getView().byId("btnUpdate").setEnabled(false);
                }
            },
            onupdtBtnPress:function (OEvent){
               // this.getView().byId("bnkRupcyList").getSelectedItems()[0].getBindingContext("bnkrupcyModel").getObject()
            }
        });
    });
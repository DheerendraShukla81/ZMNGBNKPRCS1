sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "com/okwut/mngbnkprcs/zmngbnkprcs/util/Formatter"     
    ],
    function(Controller,JSONModel) {
      "use strict";
  
      return Controller.extend("com.okwut.mngbnkprcs.zmngbnkprcs.controller.BankrupcyDetails", {
        onInit() {
          var that = this;
          var i18nModel = new sap.ui.model.resource.ResourceModel({
                        bundleName: "com.okwut.mngbnkprcs.zmngbnkprcs.i18n.i18n" });                  
          this.getView().setModel(i18nModel,"i18n");
          var pgModeDtl = {
                    "isEditable": false
                    };
                  var pgDtModeModel = new sap.ui.model.json.JSONModel();
                  pgDtModeModel .setData({
                    modelData: pgModeDtl 
                   });
                  this.getView().setModel(pgDtModeModel,"pgDtModeModel");

          this._mViewSettingsDialogs = {};
          this.router = sap.ui.core.UIComponent.getRouterFor(this);
			    this.router.getRoute("BankrupcyDetails").attachPatternMatched(this._onObjectFetched, this);
        },
        _onObjectFetched: function (oEvent) {
          var that = this;
          /*var args = oEvent.getParameter("arguments");
          this.issueID = args.issueID;*/
          this.getView().setModel(this.getOwnerComponent().getModel("bnkrupcyDetailsModel"), "bnkrupcyDetailsModel");
        },
        onBackBtnPress: function (e) {
          this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          this.oRouter.navTo("Overview",true);
          this.getView().getModel("pgDtModeModel").setProperty("/modelData/isEditable", false);
          this.getView().byId("btnChldUpdate").setEnabled(false);
          this.getView().byId("btnEdit").setVisible(true);
        },
        onEditBtnPress: function (OEvent) {
          OEvent.getSource().setVisible(false);
          this.getView().getModel("pgDtModeModel").setProperty("/modelData/isEditable", true);
      },
      onCancelBtnPress: function (OEvent) {
          this.getView().getModel("pgDtModeModel").setProperty("/modelData/isEditable", false);
          this.getView().byId("btnEdit").setVisible(true);
      },
      onChildSelectionChange:function (OEvent){
        if(OEvent.getSource().getSelectedItems().length>0){
            this.getView().byId("btnChldUpdate").setEnabled(true);
        }else{
            this.getView().byId("btnChldUpdate").setEnabled(false);
        }
    },
    onChldupdtBtnPress:function (OEvent){
       // this.getView().byId("bnkRupcyList").getSelectedItems()[0].getBindingContext("bnkrupcyModel").getObject()
    }
      });
    }
  );
  
jQuery.sap.declare("com.okwut.mngbnkprcs.zmngbnkprcs.Commons.MyRequestsPersoService");
jQuery.sap.require("sap.m.TablePersoController");

com.okwut.mngbnkprcs.zmngbnkprcs.Commons.MyRequestsPersoService = {
	getPersoService: function () {
		var MyRequestsPersoService = {
			oData: {
				_persoSchemaVersion: "1.0",
				aColumns: [{
					id: "requstType",
					"text": "Requst Type",
					visible: true,
					order: 1
				}, {
					id: "requstID",
					"text": "Requst ID",
					visible: true,
					order: 2
				}, {
					id: "companyCode",
					text: "Company Code",
					visible: true,
					order: 3
				}, {
					id: "porg",
					text: "PORG",
					visible: true,
					order: 4
				}, {
					id: "requstorName",
					text: "Requstor Name",
					visible: true,
					order: 5
				}, {
					id: "requstorEmail",
					text: "Requstor Email",
					visible: true,
					order: 6
				}, {
					id: "vendor",
					text: "Vendor",
					visible: true,
					order: 7
				}, {
					id: "purchasingAccountingNo",
					text: "Purchasing Accounting No",
					visible: true,
					order: 8
				}]
			},

			getPersData: function () {
				var oDeferred = new jQuery.Deferred();
				if (!this._oBundle) {
					this._oBundle = this.oData;
				}
				var oBundle = this._oBundle;
				oDeferred.resolve(oBundle);
				return oDeferred.promise();
			},

			setPersData: function (oBundle) {
				var oDeferred = new jQuery.Deferred();
				this._oBundle = oBundle;
				oDeferred.resolve();
				return oDeferred.promise();
			},

			resetPersData: function () {
				var oDeferred = new jQuery.Deferred();
				var oInitialData = {
					_persoSchemaVersion: "1.0",
					aColumns: [{
						id: "requstType",
						"text": "Requst Type",
						visible: true,
						order: 1
					}, {
						id: "requstID",
						"text": "Requst ID",
						visible: true,
						order: 2
					}, {
						id: "companyCode",
						text: "Company Code",
						visible: true,
						order: 3
					}, {
						id: "porg",
						text: "PORG",
						visible: true,
						order: 4
					}, {
						id: "requstorName",
						text: "Requstor Name",
						visible: true,
						order: 5
					}, {
						id: "requstorEmail",
						text: "Requstor Email",
						visible: true,
						order: 6
					}, {
						id: "vendor",
						text: "Vendor",
						visible: true,
						order: 7
					}, {
						id: "purchasingAccountingNo",
						text: "Purchasing Accounting No",
						visible: true,
						order: 8
					}]
				};

				//set personalization
				this._oBundle = oInitialData;

				//reset personalization, i.e. display table as defined
				//		this._oBundle = null;

				oDeferred.resolve();
				return oDeferred.promise();
			},

			//this caption callback will modify the TablePersoDialog' entry for the 'Weight' column
			//to 'Weight (Important!)', but will leave all other column names as they are.
			getCaption: function (oColumn) {
				if (oColumn.getHeader() && oColumn.getHeader().getText) {
					if (oColumn.getHeader().getText() === "Weight") {
						return "Weight (Important!)";
					}
				}
				return null;
			}

			/*getGroup: function (oColumn) {
				if (oColumn.getId().indexOf('productCol') != -1 ||
					oColumn.getId().indexOf('supplierCol') != -1) {
					return "Primary Group";
				}
				return "Secondary Group";
			}*/
		};
		return MyRequestsPersoService;
	}
};
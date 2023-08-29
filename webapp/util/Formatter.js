jQuery.sap.declare('com.okwut.mngbnkprcs.zmngbnkprcs.util.Formatter');
jQuery.sap.require("sap.ui.core.format.DateFormat");

com.okwut.mngbnkprcs.zmngbnkprcs.util.Formatter = {

	dateN: function (value) {
		//debugger;
		if (value) {
			var returnVal = "";
			var rtnDtFrmt = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "dd-MM-yyyy"
			});
		
			returnVal = rtnDtFrmt.format(new Date(value));
			return returnVal;
		} else {
			return value;
		}
	},
	dateD: function (value) {
		//debugger;
		if (value) {
			var returnVal = "";
			var rtnDtFrmt = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "dd-MM-yyyy"
					//	pattern: "MM-dd-yyyy"
			});
			var structuredDate = value.substr(3, 2) + "-" + value.substr(0,2) + "-" + value.substr(6,4);
            returnVal = rtnDtFrmt.format(new Date(structuredDate));

			return returnVal;
		} else {
			return value;
		}
	},
	dateInp: function (value) {
		if (value) {
			var returnVal = "";
			var rtnDtFrmt = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "dd-MM-yyyy"
			});
			var structuredDate = value.substr(3, 2) + "-" + value.substr(0, 2) + "-" + value.substr(6, 10);
			//	returnVal = rtnDtFrmt.format(new Date(structuredDate));

			return new Date(structuredDate);
		} else {
			return value;
		}
	},
	btnVisibility: function (value){
		var rtnVal=false;
		if(value === false){
			rtnVal=true;
		}
		return rtnVal;
	}
	
	
	
};
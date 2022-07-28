sap.ui.define([], function(){
    return {
        genderFormatter: function(sGender) {
            let oView = this.getView();
            let oI18nModel = oView.getModel("i18n");
            let oResourceBundle = oI18nModel.getResourceBundle();

            switch(sGender){
                case "0":
                    return oResourceBundle.getText("female");
                case "1":
                    return oResourceBundle.getText("male");
                default:
                    return "?";
            }
        }
    }
});
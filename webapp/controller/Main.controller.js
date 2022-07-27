sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
],

    function (Controller, MessageBox, MessageToast) {
        "use strict";

        return Controller.extend("at.clouddna.training00.zhoui5.controller.Main", {

            onInit: function () {

            },

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
            },

            onDeletePressed: function(oEvent){
                let sPath = oEvent.getParameters().listItem.getBindingContext().getPath();
                this._delete(sPath);
            },

            onDeleteButtonPressed: function(oEvent){
                let sPath = oEvent.getSource().getBindingContext().getPath();
                this._delete(sPath);                
            },

            _delete: function(sPath){
                let oTable = this.getView().byId("main_table_customers");

                oTable.setBusy(true);

                //let sPath = oEvent.getSource().getBindingContext().getPath();
                let oODataModel = this.getView().getModel();
                let oView = this.getView();
                let oI18nModel = oView.getModel("i18n");
                let oResourceBundle = oI18nModel.getResourceBundle();

                MessageBox.warning(oResourceBundle.getText("deleteQuestion"), {
                    title: oResourceBundle.getText("deleteTitle"),
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: function(sAction){
                        if(MessageBox.Action.YES === sAction){
                            oODataModel.remove(sPath, {
                                success: function(){
                                    MessageToast.show(oResourceBundle.getText("successfullyDeleted"));
                                    oTable.setBusy(false);
                                    //oODataModel.refresh();
                                },
                                error: function(oError){
                                    //MessageBox.error();
                                    MessageToast.show(oResourceBundle.getText("errorAtDeleted"));
                                    oTable.setBusy(false);
                                }
                            });
                        }else{
                            oTable.setBusy(false);
                        }
                    }
                });
            },

            onAfterRendering: function(){

                /*
                let oODataModel = this.getView().getModel();

                oODataModel.read("/CustomerSet", {
                    success: function(oResult){
                        debugger;
                    }
                });
                */
            },

            onListItemPressed: function(oEvent){
                let sPath = oEvent.getSource().getBindingContext().getPath();
                let oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteCustomer", {
                    path: sPath.split("/")[1]
                });
            }

        });
    });

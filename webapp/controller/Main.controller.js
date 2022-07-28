sap.ui.define([
    "at/clouddna/training00/zhoui5/controller/BaseController",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "at/clouddna/training00/zhoui5/controller/formatter/HOUI5Formatter"
],

    function (BaseController, MessageBox, MessageToast, HOUI5Formatter) {
        "use strict";

        return BaseController.extend("at.clouddna.training00.zhoui5.controller.Main", {

            formatter: HOUI5Formatter,

            onInit: function () {
                this.setContentDensity();

                let oModel = this.getOwnerComponent().getModel("cdsModel");
                //this.getView().setModel(oModel);
                //this.getView().byId("main_smarttable_customers").rebindTable();
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
                let oTable = this.getView().byId("main_smarttable_customers");

                oTable.setBusy(true);

                let oODataModel = this.getOwnerComponent().getModel();//this.getView().getModel();
                
                sPath = oODataModel.createKey("/CustomerSet", {
                    CustomerId: sPath.split("'")[1]
                });

                MessageBox.warning(this.getLocalizedText("deleteQuestion"), {
                    title: this.getLocalizedText("deleteTitle"),
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: (sAction) => {
                        if(MessageBox.Action.YES === sAction){
                            oODataModel.remove(sPath, {
                                success: () => {
                                    MessageToast.show(this.getLocalizedText("successfullyDeleted"));
                                    oTable.setBusy(false);
                                    this.getModel().refresh();
                                },
                                error: (oError) => {
                                    //MessageBox.error();
                                    MessageToast.show(this.getLocalizedText("errorAtDeleted"));
                                    oTable.setBusy(false);
                                }
                            });
                        }else{
                            oTable.setBusy(false);
                        }
                    }
                });
            },

            onListItemPressed: function(oEvent){
                let sPath = oEvent.getSource().getBindingContext().getPath();

                this.getRouter().navTo("RouteCustomer", {
                    path: sPath.split("'")[1]
                });
            },

            onAddCustomer: function(){
                this.getRouter().navTo("CreateCustomer", {}, true);
            }

        });
    });

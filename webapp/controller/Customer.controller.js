sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/core/routing/History"
],

    function (Controller, MessageBox, JSONModel, Fragment, History) {
        "use strict";

        return Controller.extend("at.clouddna.training00.zhoui5.controller.Customer", {

            _fragmentList: {},

            onInit: function () {
                console.log("onInit");
                let oEditModel = new JSONModel({
                    editmode: false
                });

                this.getView().setModel(oEditModel, "editModel");

                this._showCustomerFragment("DisplayCustomer");

                let oRouter = this.getOwnerComponent().getRouter();
                
                oRouter.getRoute("RouteCustomer").attachPatternMatched(this._onPatternMatched, this);
                
                /*
                oModel.loadData("data/customers.json");

                oModel.setData({
                    editmode: false
                });
                */
            },

            _onPatternMatched: function(oEvent){
                let sPath = "/" + oEvent.getParameters().arguments.path;
                //this.getView().createId(sFragmentName, "display_form_customer")
                this.getView().bindElement(sPath);
            },

            /*
            onExit: function() {},
            onBeforeRendering: function() {},
            onAfterRendering: function() {},
            */

            genderFormatter: function(sGender) {
                let oView = this.getView();
                let oI18nModel = oView.getModel("i18n");
                let oResourceBundle = oI18nModel.getResourceBundle();
                let sText = oResourceBundle.getText(sGender);
                return sText;
            },

            _showCustomerFragment: function(sFragmentName){
                //Clearing the content of the page
                let oPage = this.getView().byId("page");
                oPage.removeAllContent();

                //Load the Fragment sFragmentName setting it to the content of the page
                if(this._fragmentList[sFragmentName]){
                    oPage.insertContent(this._fragmentList[sFragmentName]);
                }else{
                    Fragment.load({
                        id: this.getView().createId(sFragmentName),
                        name: "at.clouddna.training00.zhoui5.view.fragment." + sFragmentName,
                        controller: this
                    }).then(function(oFragment){
                        this._fragmentList[sFragmentName] = oFragment;
                        oPage.insertContent(this._fragmentList[sFragmentName]);
                    }.bind(this));
                }
            },

            onEditPressed: function(){
                this._toggleEdit(true);
                /*
                let oEditModel = this.getView().getModel("editModel");
                oEditModel.setProperty("/editmode", true);

                this._showCustomerFragment("ChangeCustomer");
                */
            },

            onSavePressed: function(){
                this._toggleEdit(false);
                /*
                let oEditModel = this.getView().getModel("editModel");
                oEditModel.setProperty("/editmode", false);

                this._showCustomerFragment("DisplayCustomer");
                */
                /*
                let oModel = this.getView().getModel();
                let oData = oModel.getData();
                MessageBox.success("Customer Data: " + JSON.stringify(oData));
                */
            },

            onCancelPressed: function(){
                this._toggleEdit(false);
                /*
                let oEditModel = this.getView().getModel("editModel");
                oEditModel.setProperty("/editmode", false);

                this._showCustomerFragment("DisplayCustomer");
                */
            },

            _toggleEdit: function(bEditMode) {
                let oEditModel = this.getView().getModel("editModel");
                oEditModel.setProperty("/editmode", bEditMode);

                this._showCustomerFragment(bEditMode ? "ChangeCustomer" : "DisplayCustomer");
            },

            onNavBack: function () {
                var oHistory = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();
    
                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    var oRouter = this.getOwnerComponent().getRouter();
                    oRouter.navTo("Main", {}, true);
                }
            }

        });
    });

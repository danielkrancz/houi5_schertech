sap.ui.define([
    "at/clouddna/training00/zhoui5/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "at/clouddna/training00/zhoui5/controller/formatter/HOUI5Formatter",
    "sap/ui/core/Item"
],

    function (BaseController, JSONModel, Fragment, HOUI5Formatter, Item) {
        "use strict";

        return BaseController.extend("at.clouddna.training00.zhoui5.controller.Customer", {

            _fragmentList: {},
            _bCreate: false,
            formatter: HOUI5Formatter,

            onInit: function () {

                this.setContentDensity();

                let oEditModel = new JSONModel({
                    editmode: false
                });

                this.getView().setModel(oEditModel, "editModel");
                
                this.getRouter().getRoute("RouteCustomer").attachPatternMatched(this._onPatternMatched, this);
                this.getRouter().getRoute("CreateCustomer").attachPatternMatched(this._onCreatePatternMatched, this);
            },

            _onPatternMatched: function(oEvent){
                this._bCreate = false;

                let sPath = this.getModel().createKey("/CustomerSet", {
                    CustomerId: oEvent.getParameters().arguments.path
                });
                
                this.getView().bindElement(sPath);
                this._showCustomerFragment("DisplayCustomer");
            },

            _onCreatePatternMatched: function(){
                this._bCreate = true;

                let oModel = this.getModel();

                let oContext = oModel.createEntry("/CustomerSet");
                this.getView().bindElement(oContext.getPath());
                this._showCustomerFragment("ChangeCustomer");
                this.getView().getModel("editModel").setProperty("/editmode", true);
            },

            _showCustomerFragment: function(sFragmentName){
                let oPage = this.getView().byId("page");
                oPage.removeAllContent();

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
            },

            onSavePressed: function(){
                let oModel = this.getView().getModel();
                oModel.submitChanges({
                    success: () => {
                        if(this._bCreate){
                            this.onNavBack();
                        }
                        this._toggleEdit(false);
                    }
                });
            },

            onCancelPressed: function(){
                let oModel = this.getView().getModel();
                oModel.resetChanges();
                if(this._bCreate){
                    this.onNavBack();
                }
                this._toggleEdit(false);
            },

            _toggleEdit: function(bEditMode) {
                let oEditModel = this.getView().getModel("editModel");
                oEditModel.setProperty("/editmode", bEditMode);

                this._showCustomerFragment(bEditMode ? "ChangeCustomer" : "DisplayCustomer");
            },

            onOpenAttachments: function(){
                let oView = this.getView();

                if(!this._pDialog){
                    this._pDialog = Fragment.load({
                        id: oView.getId(),
                        name: "at.clouddna.training00.zhoui5.view.fragment.AttachmentDialog",
                        controller: this
                    }).then(function(oDialog){
                        oView.addDependent(oDialog);
                        return oDialog;
                    }.bind(this));
                }

                this._pDialog.then((oDialog) => {
                    //Set the upload URL dynamically
                    let sServiceUrl = this.getView().getModel().sServiceUrl;
                    let sPath = sServiceUrl + this.getView().getElementBinding().getPath() + "/Documents";
                    let oUploadSet = this.getView().byId("attachments_uploadset");
                    oUploadSet.setUploadUrl(sPath);

                    //Open the Dialog
                    oDialog.open();
                });
            },

            onAfterItemAdded: function(oEvent){
                let oUploadSet = this.getView().byId("attachments_uploadset");
                let oUploadSetItem = oEvent.getParameters().item;

                oUploadSet.removeAllHeaderFields();

                let oItem = new Item({
                    key: "x-csrf-token",
                    text: this.getView().getModel().getSecurityToken()
                });

                oUploadSet.addHeaderField(oItem);

                oItem = new Item({
                    key: "slug",
                    text: oUploadSetItem.getFileName()
                });

                oUploadSet.addHeaderField(oItem);
            },
            
            onAttachmentsDialogClose: function(){
                this._pDialog.then((oDialog) => {
                    oDialog.close();
                });
            },

            formatUrl: function(sDocId){
                // /sap/opu/odata/sap/ZHOUI5_CUSTOMER_SRV/CustomerDocumentSet(guid'b9dc11c0-71cc-1eed-83ca-d903844a462b')/$value
                let sServiceUrl = this.getModel().sServiceUrl;
                let sDocPath =  this.getModel().createKey("/CustomerDocumentSet", {
                    DocId: sDocId
                });

                return sServiceUrl + sDocPath + "/$value";
            },

            onRemovePressed: function(oEvent){
                oEvent.preventDefault();

                let sPath = oEvent.getSource().getBindingContext().getPath();
                this.getView().getModel().remove(sPath);
            },

            onUploadCompleted: function(){
                this.getModel().refresh(true);
            }

        });
    });

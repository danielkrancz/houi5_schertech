sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/base/Log"
],

    function (Controller, History, Log) {
        "use strict";

        return Controller.extend("at.clouddna.training00.zhoui5.controller.BaseController", {

            constructor: function(){
                /*
                console.log("constructor");
                this.getView().attachAfterRendering(() => {
                    this.setContentDensity();
                });
                */
                //this.setContentDensity();
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
            },

            logDebug: function(sMessage){
                let oLogger = Log.getLogger(this.getView().getControllerName());
                oLogger.debug("DEBUG - " + sMessage);
            },

            logError: function (sMessage) {
                let oLogger = Log.getLogger(this.getView().getControllerName());
                oLogger.error("ERROR - " + sMessage);
            },
            
            logFatal: function (sMessage) {
                let oLogger = Log.getLogger(this.getView().getControllerName());
                oLogger.fatal("FATAL - " + sMessage);
            },
            
            logInfo: function (sMessage) {
                let oLogger = Log.getLogger(this.getView().getControllerName());
                oLogger.info("INFO - " + sMessage);
            },
            
            logTrace: function (sMessage) {
                let oLogger = Log.getLogger(this.getView().getControllerName());
                oLogger.trace("TRACE - " + sMessage);
            },
            
            logWarning: function (sMessage) {
                let oLogger = Log.getLogger(this.getView().getControllerName());
                oLogger.warning("WARNING - " + sMessage);
            },
            
            _sContentDensityClass: "",

            _getContentDensity: function(){
                if(!this._sContentDensityClass){
                    if(sap.ui.Device.support.touch){
                        this._sContentDensityClass = "sapUiSizeCozy";
                    }else{
                        this._sContentDensityClass = "sapUiSizeCompact";
                    }
                }

                return this._sContentDensityClass;
            },

            setContentDensity: function(){
                this.getView().addStyleClass(this._getContentDensity());
            },

            getRouter: function(){
                return this.getOwnerComponent().getRouter();
            },

            getModel: function(sName){
                return this.getView().getModel(sName);
            },

            setModel: function(oModel, sName){
                return this.getView().setModel(oModel, sName);
            },

            getLocalizedText: function(sId, aParams){
                let oI18nModel = this.getOwnerComponent().getModel("i18n");
                let oBundle = oI18nModel.getResourceBundle();
                let sText = oBundle.getText(sId, aParams);
                return sText;
            }

        });
    });

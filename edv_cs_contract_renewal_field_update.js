/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(["N/currentRecord"], function (currentRecord) {
    function pageInit(context) {
      var currentRec = context.currentRecord;
  
      // Get the customform field value
      var customFormValue = currentRec.getValue({
        fieldId: "customform",
      });
  
      // Check if the customform value is '192'
      if (customFormValue === "192") {
        // Set the value of field custbody_tran_term_in_months to 12
        currentRec.setValue({
          fieldId: "custbody_tran_term_in_months",
          value: 12,
        });
  
        // Set the value of field startdate to today's date
        currentRec.setValue({
          fieldId: "startdate",
          value: new Date(),
        });
  
        // Set the value of field enddate to 1 year from today
        var today = new Date();
        var oneYearLater = new Date(today.getTime());
        oneYearLater.setFullYear(today.getFullYear() + 1);
        currentRec.setValue({
          fieldId: "enddate",
          value: oneYearLater,
        });
      }
    }
  
    return {
      pageInit: pageInit,
    };
  });
  
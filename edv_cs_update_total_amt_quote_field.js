/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/log'], function(record, log) {

    function saveRecord(context) {
      var currentRecord = context.currentRecord;
      var customFormValue = currentRecord.getValue({ fieldId: 'customform' });
  
      if (customFormValue === '181') { //e-Rate quote form
        var lineCount = currentRecord.getLineCount({ sublistId: 'item' });
        var totalLineAmount = 0;
  
        for (var i = 0; i < lineCount; i++) {
          var lineAmount = 0;
  
          try {
            var erateAmountValue = currentRecord.getSublistValue({ sublistId: 'item', fieldId: 'custcol_syn_erateamount', line: i });
            var quantityValue = currentRecord.getSublistValue({ sublistId: 'item', fieldId: 'quantity', line: i });
  
            lineAmount = parseFloat(erateAmountValue || 0) * parseFloat(quantityValue || 0);
          } catch (e) {
            // Handle the error
            log.error({ title: 'Line Calculation Error', details: e.message });
          }
  
          totalLineAmount += lineAmount;
        }
  
        // Set the total line amount in the custom field
        try {
          currentRecord.setValue({ fieldId: 'custbody_item_amount_total', value: totalLineAmount.toFixed(2) });
  
          // Log the audit
          log.audit({ title: 'Audit Log', details: 'Total Line Amount: ' + totalLineAmount.toFixed(2) });
        } catch (e) {
          // Handle the error
          log.error({ title: 'Setting Custom Field "Item Amount Total" Error', details: e.message });
        }
  
      } else if (customFormValue === '163') { //Standard quote form
        var lineCount = currentRecord.getLineCount({ sublistId: 'item' });
        var totalLineAmount = 0;
  
        for (var i = 0; i < lineCount; i++) {
          var lineAmount = 0;
  
          try {
            var rateValue = currentRecord.getSublistValue({ sublistId: 'item', fieldId: 'rate', line: i });
            var quantityValue = currentRecord.getSublistValue({ sublistId: 'item', fieldId: 'quantity', line: i });
  
            lineAmount = parseFloat(rateValue || 0) * parseFloat(quantityValue || 0);
          } catch (e) {
            // Handle the error
            log.error({ title: 'Line Calculation Error', details: e.message });
          }
  
          totalLineAmount += lineAmount;
        }
  
        // Set the total line amount in the custom field
        try {
          currentRecord.setValue({ fieldId: 'custbody_item_amount_total', value: totalLineAmount.toFixed(2) });
  
          // Log the audit
          log.audit({ title: 'Audit Log', details: 'Total Line Amount: ' + totalLineAmount.toFixed(2) });
        } catch (e) {
          // Handle the error
          log.error({ title: 'Setting Custom Field "Item Amount Total" Error', details: e.message });
        }
      }
  
      return true; // Allow the record to be saved
    }
  
    return {
      saveRecord: saveRecord
    };
  });
  
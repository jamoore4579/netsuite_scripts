/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/log'], function(record, log) {

  function saveRecord(context) {
    var currentRecord = context.currentRecord;
    var customFormValue = currentRecord.getValue({ fieldId: 'customform' });

    if (customFormValue === '180') {
      var lineCount = currentRecord.getLineCount({ sublistId: 'item' });
      var totalErateAmount = 0;
      var totalQuantity = 0;

      for (var i = 0; i < lineCount; i++) {
        var erateAmountValue;
        var quantityValue;

        try {
          erateAmountValue = currentRecord.getSublistValue({ sublistId: 'item', fieldId: 'custcol_syn_erateamount', line: i });
          totalErateAmount += parseFloat(erateAmountValue || 0);
        } catch (e) {
          // Handle the error
          log.error({ title: 'Custom Field "custcol_syn_erateamount" Error', details: e.message });
        }

        try {
          quantityValue = currentRecord.getSublistValue({ sublistId: 'item', fieldId: 'quantity', line: i });
          totalQuantity += parseFloat(quantityValue || 0);
        } catch (e) {
          // Handle the error
          log.error({ title: 'Custom Field "quantity" Error', details: e.message });
        }
      }

      // Set the total values in a custom field
      try {
        currentRecord.setValue({ fieldId: 'custcol_total_amt', value: totalErateAmount.toFixed(2) + ' / ' + totalQuantity });

        // Log the audit
        log.audit({ title: 'Audit Log', details: 'Total Erate Amount: ' + totalErateAmount.toFixed(2) + ', Total Quantity: ' + totalQuantity });
      } catch (e) {
        // Handle the error
        log.error({ title: 'Setting Custom Field "custcol_total_amt" Error', details: e.message });
      }
    }

    return true; // Allow the record to be saved
  }

  return {
    saveRecord: saveRecord
  };
});

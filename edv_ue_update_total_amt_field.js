/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record'], function(record) {

  function afterSubmit(context) {
    if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.EDIT) {
      var currentRecord = context.newRecord;
      var customFormValue;
      
      try {
        log.audit(customFormValue = currentRecord.getValue({ fieldId: 'customform'}));
      } catch (e) {
        // Handle the error
        log.error({ title: 'Custom Form Value Error', details: e.message });
        return;
      }

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
          currentRecord.setValue({ sublistId: 'item', fieldId: 'custcol_total_amt', value: totalErateAmount.toFixed(2) + ' / ' + totalQuantity });
        } catch (e) {
          // Handle the error
          log.error({ title: 'Setting Custom Field "custcol_total_amt" Error', details: e.message });
        }

        // Save the record
        try {
          var recordId = currentRecord.save();
          log.audit({ title: 'Record Saved', details: 'Record ID: ' + recordId });
        } catch (e) {
          // Handle the error
          log.error({ title: 'Record Save Error', details: e.message });
        }
      }
    }
  }

  return {
    afterSubmit: afterSubmit
  };
});

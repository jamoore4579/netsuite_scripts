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

        for (var i = 0; i < lineCount; i++) {
          var erateAmountValue;
          var quantityValue;

          try {
            erateAmountValue = currentRecord.getSublistValue({ sublistId: 'item', fieldId: 'custcol_syn_erateamount', line: i });
          } catch (e) {
            // Handle the error
            log.error({ title: 'Custom Field "custcol_erate_amount" Error', details: e.message });
          }

          try {
            quantityValue = currentRecord.getSublistValue({ sublistId: 'item', fieldId: 'quantity', line: i });
          } catch (e) {
            // Handle the error
            log.error({ title: 'Custom Field "quantity" Error', details: e.message });
          }

          // Log the values using log.audit
          log.audit({ title: 'Line Item Values - Line ' + (i + 1), details: 'erate_amount: ' + erateAmountValue + ', quantity: ' + quantityValue });
        }
      }
    }
  }

  return {
    afterSubmit: afterSubmit
  };
});

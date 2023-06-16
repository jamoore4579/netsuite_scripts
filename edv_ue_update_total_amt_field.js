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
        var erateAmountValue;
        var quantityValue;

        try {
          erateAmountValue = currentRecord.getValue({ fieldId: 'custcol_syn_erateamount' });
        } catch (e) {
          // Handle the error
          log.error({ title: 'Custom Field "erate_amount" Error', details: e.message });
        }

        try {
          quantityValue = currentRecord.getValue({ fieldId: 'quantity' });
        } catch (e) {
          // Handle the error
          log.error({ title: 'Custom Field "quantity" Error', details: e.message });
        }

        // Log the values using log.audit
        log.audit({ title: 'Custom Field Values', details: 'erate_amount: ' + erateAmountValue + ', quantity: ' + quantityValue });
      }
    }
  }

  return {
    afterSubmit: afterSubmit
  };
});

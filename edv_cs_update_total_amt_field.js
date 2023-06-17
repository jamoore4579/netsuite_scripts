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
        var itemName;
        var erateAmountValue;
        var quantityValue;

        try {
          itemName = currentRecord.getSublistValue({ sublistId: 'item', fieldId: 'item_display', line: i });
          erateAmountValue = currentRecord.getSublistValue({ sublistId: 'item', fieldId: 'custcol_syn_erateamount', line: i });

          if (erateAmountValue !== 0) {
            totalErateAmount += parseFloat(erateAmountValue || 0);
            quantityValue = currentRecord.getSublistValue({ sublistId: 'item', fieldId: 'quantity', line: i });
            totalQuantity += parseFloat(quantityValue || 0);
          }
        } catch (e) {
          // Handle the error
          log.error({ title: 'Custom Field "custcol_syn_erateamount" Error', details: e.message });
        }
      }

      // Calculate the total amount
      var totalAmount = totalErateAmount * totalQuantity;

      // Set the total amount in the custom field
      try {
        currentRecord.setValue({ fieldId: 'custbody_item_amount_total', value: totalAmount.toFixed(2) });

        // Log the audit
        log.audit({ title: 'Audit Log', details: 'Total Amount: ' + totalAmount.toFixed(2) });
      } catch (e) {
        // Handle the error
        log.error({ title: 'Setting Custom Field "cust_total_field" Error', details: e.message });
      }

    } else if (customFormValue === '143') {
      var rateValue;
      var quantityValue;

      try {
        rateValue = currentRecord.getValue({ sublistId: 'item', fieldId: 'rate' });
        quantityValue = currentRecord.getValue({ sublistId: 'item', fieldId: 'quantity' });
      } catch (e) {
        // Handle the error
        log.error({ title: 'Custom Form "143" Error', details: e.message });
      }

      // Calculate the total amount
      var totalAmount = parseFloat(rateValue || 0) * parseFloat(quantityValue || 0);

      // Set the total amount in the custom field
      try {
        currentRecord.setValue({ fieldId: 'custbody_item_amount_total', value: totalAmount.toFixed(2) });

        // Log the audit
        log.audit({ title: 'Audit Log', details: 'Total Amount: ' + totalAmount.toFixed(2) });
      } catch (e) {
        // Handle the error
        log.error({ title: 'Setting Custom Field "custbody_item_amount_total" Error', details: e.message });
      }
    }

    return true; // Allow the record to be saved
  }

  return {
    saveRecord: saveRecord
  };
});

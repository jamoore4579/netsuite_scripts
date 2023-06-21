/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/log', 'N/record'], function(log, record) {

  function saveRecord(context) {
    try {

    var currentRecord = context.currentRecord;
    var customFormId = currentRecord.getValue({
      fieldId: 'customform'
    });

    var documentNumber = currentRecord.getValue({
      fieldId: 'tranid'
    });

    // Determine which custom form is being used
    if (customFormId === '143') {

      var lineCount = currentRecord.getLineCount({
        sublistId: 'item'
      });

      var totalAmount = 0;
      var hasTaxRate = false;
      var taxRatePercent = 0;

      for (var i = 0; i < lineCount; i++) {
        var itemName = currentRecord.getSublistValue({
          sublistId: 'item',
          fieldId: 'item_display',
          line: i
        });

        if (itemName !== 'description') {
          var quantity = currentRecord.getSublistValue({
            sublistId: 'item',
            fieldId: 'quantity',
            line: i
          });

          var rate = currentRecord.getSublistValue({
            sublistId: 'item',
            fieldId: 'rate',
            line: i
          });

          totalAmount += quantity * rate;

          if (!hasTaxRate) {
            taxRatePercent = currentRecord.getSublistValue({
              sublistId: 'item',
              fieldId: 'taxrate1',
              line: i
            });

            if (taxRatePercent) {
              hasTaxRate = true;
            }
          }
        }
      }

      if (hasTaxRate) {
        var taxAmount = (totalAmount * taxRatePercent) / 100;
        totalAmount += taxAmount;
      }

      currentRecord.setValue({
        fieldId: 'custbody_item_amount_total',
        value: totalAmount.toFixed(2)
      });

      log.audit({ title: 'Audit Log', details: 'Doc #: ' + documentNumber + ', Total Amount: ' + totalAmount.toFixed(2) });

      // Add your custom logic for Custom Form 163 here

    } else if (customFormId === '180') {

      var lineCount = currentRecord.getLineCount({
        sublistId: 'item'
      });

      var totalAmount = 0;
      var hasTaxRate = false;
      var taxRatePercent = 0;

      for (var i = 0; i < lineCount; i++) {
        var itemName = currentRecord.getSublistValue({
          sublistId: 'item',
          fieldId: 'item_display',
          line: i
        });

        if (itemName !== 'description') {
          var quantity = currentRecord.getSublistValue({
            sublistId: 'item',
            fieldId: 'quantity',
            line: i
          });

          var rate = currentRecord.getSublistValue({
            sublistId: 'item',
            fieldId: 'custcol_syn_erateamount',
            line: i
          });

          totalAmount += quantity * rate;

          if (!hasTaxRate) {
            taxRatePercent = currentRecord.getSublistValue({
              sublistId: 'item',
              fieldId: 'taxrate1',
              line: i
            });

            if (taxRatePercent) {
              hasTaxRate = true;
            }
          }
        }
      }

      if (hasTaxRate) {
        var taxAmount = (totalAmount * taxRatePercent) / 100;
        totalAmount += taxAmount;
      }

      currentRecord.setValue({
        fieldId: 'custbody_item_amount_total',
        value: totalAmount.toFixed(2)
      });

      log.audit({ title: 'Audit Log', details: 'Doc #: ' + documentNumber + ', Total Amount: ' + totalAmount.toFixed(2) });

    }

    return true; // Allows the record to be saved

  } catch (error) {
    log.error({
      title: 'Error in saveRecord',
      details: 'An error occurred: ' + error.message
    });

    return false; // Prevents the record from being saved
  }
}

  return {
    saveRecord: saveRecord
  };
});

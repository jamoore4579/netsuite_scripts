/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/log', 'N/record'], function(log, record) {

  function saveRecord(context) {
    var currentRecord = context.currentRecord;
    var customFormId = currentRecord.getValue({
      fieldId: 'customform'
    });

    var documentNumber = currentRecord.getValue({
      fieldId: 'tranid'
    });

    // Determine which custom form is being used
    if (customFormId === '163') {

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

      log.audit({ title: 'Audit Log', details: 'Total Amount: ' + totalAmount.toFixed(2) });
      
      log.audit({ title: 'Log Audit', details: 'Document Number: ' + documentNumber });

    } else if (customFormId === '181') {

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

      log.audit({ title: 'Log Audit', details: 'Total Amount: ' + totalAmount.toFixed(2) });

      log.audit({ title: 'Log Audit', details: 'Document Number: ' + documentNumber });

    }

    return true; // Allows the record to be saved
  }

  return {
    saveRecord: saveRecord
  };
});

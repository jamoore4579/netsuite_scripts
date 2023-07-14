/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search'], function(record, search) {

  function execute(context) {
    // Load the saved search to retrieve the estimates
    var savedSearchId = '1144'; // Replace with your saved search ID
    var savedSearch = search.load({ id: savedSearchId });

    // Run the search and process each estimate
    savedSearch.run().each(processSalesOrder);
  }

  function processSalesOrder(result) {
    var salesOrderId = result.id;
    var salesOrderRecord = record.load({
      type: record.Type.SALES_ORDER,
      id: salesOrderId,
      isDynamic: true // Load the record in edit mode
    });

    var documentNumber = salesOrderRecord.getValue({
      fieldId: 'tranid'
    })

    try {
        
        var lineCount = salesOrderRecord.getLineCount({
          sublistId: 'item'
        });
  
        var totalAmount = 0;
        var hasTaxRate = false;
        var taxRatePercent = 0;
  
        for (var i = 0; i < lineCount; i++) {
          var itemName = salesOrderRecord.getSublistValue({
            sublistId: 'item',
            fieldId: 'item_display',
            line: i
          });
  
          if (itemName !== 'description') {
            var quantity = salesOrderRecord.getSublistValue({
              sublistId: 'item',
              fieldId: 'quantity',
              line: i
            });
  
            var rate = salesOrderRecord.getSublistValue({
              sublistId: 'item',
              fieldId: 'rate',
              line: i
            });
  
            totalAmount += quantity * rate;
  
            if (!hasTaxRate) {
              taxRatePercent = salesOrderRecord.getSublistValue({
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
  
        salesOrderRecord.setValue({
          fieldId: 'custbody_item_amount_total',
          value: totalAmount.toFixed(2)
        });
  
        log.audit({ title: 'Audit Log', details: 'Doc #: ' + documentNumber + ', Total Amount: ' + totalAmount.toFixed(2) });

      

      // Save the changes to the estimate record
      salesOrderRecord.save({
        ignoreMandatoryFields: true // Ignore mandatory fields to allow saving incomplete records
      });
    } catch (e) {
      // Handle any errors that occurred during processing
      log.error({
        title: 'Error Processing Sales Order',
        details: 'Sales Order: ' + salesOrderId + ', Error: ' + e.message
      });
    }

    return true; // Continue processing remaining estimates in the search
  }

  return {
    execute: execute
  };
});

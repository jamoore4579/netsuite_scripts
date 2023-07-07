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
    savedSearch.run().each(processEstimate);
  }

  function processEstimate(result) {
    var estimateId = result.id;
    var estimateRecord = record.load({
      type: record.Type.ESTIMATE,
      id: estimateId,
      isDynamic: true // Load the record in edit mode
    });

    var documentNumber = estimateRecord.getValue({
      fieldId: 'tranid'
    })

    // Get the custom form ID of the estimate
    var customFormId = estimateRecord.getValue({ fieldId: 'customform' });


    try {
      if (customFormId === '163') {
        
        var lineCount = estimateRecord.getLineCount({
          sublistId: 'item'
        });
  
        var totalAmount = 0;
        var hasTaxRate = false;
        var taxRatePercent = 0;
  
        for (var i = 0; i < lineCount; i++) {
          var itemName = estimateRecord.getSublistValue({
            sublistId: 'item',
            fieldId: 'item_display',
            line: i
          });
  
          if (itemName !== 'description') {
            var quantity = estimateRecord.getSublistValue({
              sublistId: 'item',
              fieldId: 'quantity',
              line: i
            });
  
            var rate = estimateRecord.getSublistValue({
              sublistId: 'item',
              fieldId: 'rate',
              line: i
            });
  
            totalAmount += quantity * rate;
  
            if (!hasTaxRate) {
              taxRatePercent = estimateRecord.getSublistValue({
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
  
        estimateRecord.setValue({
          fieldId: 'custbody_item_amount_total',
          value: totalAmount.toFixed(2)
        });
  
        log.audit({ title: 'Audit Log', details: 'Doc #: ' + documentNumber + ', Total Amount: ' + totalAmount.toFixed(2) });

      } else if (customFormId === '181') {
        
        var lineCount = estimateRecord.getLineCount({
          sublistId: 'item'
        });
  
        var totalAmount = 0;
        var hasTaxRate = false;
        var taxRatePercent = 0;
  
        for (var i = 0; i < lineCount; i++) {
          var itemName = estimateRecord.getSublistValue({
            sublistId: 'item',
            fieldId: 'item_display',
            line: i
          });
  
          if (itemName !== 'description') {
            var quantity = estimateRecord.getSublistValue({
              sublistId: 'item',
              fieldId: 'quantity',
              line: i
            });
  
            var rate = estimateRecord.getSublistValue({
              sublistId: 'item',
              fieldId: 'rate',
              line: i
            });
  
            totalAmount += quantity * rate;
  
            if (!hasTaxRate) {
              taxRatePercent = estimateRecord.getSublistValue({
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
  
        estimateRecord.setValue({
          fieldId: 'custbody_item_amount_total',
          value: totalAmount.toFixed(2)
        });
  
        log.audit({ title: 'Audit Log', details: 'Doc #: ' + documentNumber + ', Total Amount: ' + totalAmount.toFixed(2) });
      }

      // Save the changes to the estimate record
      estimateRecord.save({
        ignoreMandatoryFields: true // Ignore mandatory fields to allow saving incomplete records
      });
    } catch (e) {
      // Handle any errors that occurred during processing
      log.error({
        title: 'Error Processing Estimate',
        details: 'Estimate: ' + estimateId + ', Error: ' + e.message
      });
    }

    return true; // Continue processing remaining estimates in the search
  }

  return {
    execute: execute
  };
});

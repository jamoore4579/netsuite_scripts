/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */

define(['N/search', 'N/record', 'N/runtime', 'N/log'], function(search, record, runtime, log) {

  function execute(context) {
    try {
      // Load the saved search
      var searchId = '1144';
      var savedSearch = search.load({ id: searchId });

      var searchResults = savedSearch.run().getRange(0, 1000);

      // Iterate through the search results
      for (var i = 0; i < searchResults.length; i++) {
        var searchResult = searchResults[i];
        var quoteId = searchResult.getValue({ name: 'internalid' });
        
        var documentNumber = searchResult.getValue({ name: 'tranid' });
        

        try {
          // Load the Quote record in edit mode
          var currentRecord = record.load({ type: 'estimate', id: quoteId, isDynamic: true });

          // Get the custom form ID
          //var currentRecord = context.currentRecord;
          var customFormId = currentRecord.getValue({ fieldId: 'customform' });

          // Perform calculations based on the custom form
          if (customFormId === '143') {
            
            var lineCount = currentRecord.getLineCount({ sublistId: 'item' });
        
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

          // Save the quote record
          currentRecord.save();
        } catch (ex) {
          // Log the error and continue processing other records
          log.error({ title: 'Error processing Quote ID', details: quoteId });
          log.error({ title: 'Error Details', details: ex.toString() });
        }
      }
    } catch (e) {
      // Log the overall error
      log.error({ title: 'Error in scheduled script', details: e.toString() });
    }
  }

  return {
    execute: execute
  };

});

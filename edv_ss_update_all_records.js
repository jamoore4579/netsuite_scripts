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
        var salesOrderId = searchResult.getValue({ name: 'internalid' });
        var documentNumber = searchResult.getValue({ name: 'tranid' });

        try {
          // Load the sales order record in edit mode
          var salesOrder = record.load({ type: 'salesorder', id: salesOrderId, isDynamic: true });

          // Get the custom form ID
          var currentRecord = context.currentRecord;
          var customFormId = salesOrder.getValue({ fieldId: 'customform' });

          // Perform calculations based on the custom form
          if (customFormId === '143') {
            var lineItemCount = salesOrder.getLineCount({ sublistId: 'item' });
            var total = 0;

            // Iterate through each item on the order
            for (var h = 0; h < lineItemCount; h++) {
              var rate = parseFloat(salesOrder.getSublistValue({ sublistId: 'item', fieldId: 'rate', line: h }));
              var quantity = parseFloat(salesOrder.getSublistValue({ sublistId: 'item', fieldId: 'quantity', line: h }));
              var taxCode = salesOrder.getSublistValue({ sublistId: 'item', fieldId: 'taxcode', line: j });
              var lineTotal = rate * quantity;

              if (taxCode !== '-Not Taxable-') {
                var taxRate = parseFloat(salesOrder.getSublistValue({ sublistId: 'item', fieldId: 'taxrate1', line: j }));
                lineTotal *= (1 + taxRate / 100);
              }

              total += lineTotal;
            }

            // Update custom field "item amount" with the total value
            salesOrder.setValue({ fieldId: 'custbody_item_amount_total', value: total });

            log.debug({ title: 'Sales Order ID', details: salesOrderId });
            log.debug({ title: 'Total', details: total });
            log.debug({ title: 'Document #', details: documentNumber})

          } else if (customFormId === '180') {
            var lineItemCount = salesOrder.getLineCount({ sublistId: 'item' });
            var total = 0;

            // Iterate through each item on the order
            for (var j = 0; j < lineItemCount; j++) {
              var erate = parseFloat(salesOrder.getSublistValue({ sublistId: 'item', fieldId: 'custcol_syn_erateamount', line: j }));
              var quantity = parseFloat(salesOrder.getSublistValue({ sublistId: 'item', fieldId: 'quantity', line: j }));
              var taxCode = salesOrder.getSublistValue({ sublistId: 'item', fieldId: 'taxcode', line: j });
              var lineTotal = erate * quantity;

              if (taxCode !== '-Not Taxable-') {
                var taxRate = parseFloat(salesOrder.getSublistValue({ sublistId: 'item', fieldId: 'taxrate1', line: j }));
                lineTotal *= (1 + taxRate / 100);
              }
              
              total += lineTotal;
            }

            // Update custom field "item amount" with the total value
            salesOrder.setValue({ fieldId: 'custbody_item_amount_total', value: total });

            log.debug({ title: 'Sales Order ID', details: salesOrderId });
            log.debug({ title: 'Total', details: total });
            log.debug({ title: 'Document #', details: documentNumber})
          }

          // Save the sales order record
          salesOrder.save();
        } catch (ex) {
          // Log the error and continue processing other records
          log.error({ title: 'Error processing Sales Order ID', details: salesOrderId });
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
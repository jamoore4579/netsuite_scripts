/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */

/**
 * NetSuite Client Script to populate the sublist line rate
 * when customer_rate_amount is populated in the item sublist.
 */

define([], function () {

    /**
     * Function to be executed when the customer_rate_amount field changes.
     * @param {Object} context - The context of the current record.
     */
    function fieldChanged(context) {
      // Check if the field that changed is the 'customer_rate_amount' field
      // in the 'item' sublist.
      if (context.sublistId === 'item' && context.fieldId === 'custcol_syn_erateamount') {
        // Get the current record object.
        var currentRecord = context.currentRecord;
  
        // Get the value of the 'customer_rate_amount' field in the 'item' sublist.
        var rateAmount = currentRecord.getCurrentSublistValue({
          sublistId: 'item',
          fieldId: 'custcol_syn_erateamount'
        });
  
        // Check if the rate amount is not empty.
        if (rateAmount) {
          // Get the index of the sublist line you want to update.
          var lineIndex = context.line; // Use the current line index.
  
          // Set the rate on the sublist line in the 'item' sublist.
          currentRecord.setCurrentSublistValue({
            sublistId: 'item',
            fieldId: 'rate', // Replace with the actual field ID for the rate field.
            value: rateAmount
          });
  
          // Commit the current line to persist the changes.
          currentRecord.commitLine({
            sublistId: 'item'
          });
        }
      }
    }
  
    return {
      fieldChanged: fieldChanged
    };
  
  });
  
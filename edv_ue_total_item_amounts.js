/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record'],
  function(record) {
    function beforeSubmit(context) {
      try {
        if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.EDIT) {
          var newRecord = context.newRecord;
          var itemCount = newRecord.getLineCount({
            sublistId: 'item'
          });

          var totalAmount = 0;
          for (var i = 0; i < itemCount; i++) {
            var itemAmount = newRecord.getSublistValue({
              sublistId: 'item',
              fieldId: 'amount',
              line: i
            });
            if (itemAmount) {
              totalAmount += parseFloat(itemAmount);
            }
          }

          newRecord.setValue({
            fieldId: 'custbody_item_amount_total',
            value: totalAmount.toFixed(2) // Rounded to 2 decimal places
          });
        }
      } catch (error) {
        log.error({
          title: 'Error calculating total amount',
          details: error.message
        });
      }
    }

    return {
      beforeSubmit: beforeSubmit
    };
  });

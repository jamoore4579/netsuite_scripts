/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record'],
  function(record) {
    function beforeSubmit(context) {
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
          totalAmount += itemAmount;
        }

        newRecord.setValue({
          fieldId: 'custbody_item_amount_total',
          value: totalAmount
        });
      }
    }

    return {
      beforeSubmit: beforeSubmit
    };
  });

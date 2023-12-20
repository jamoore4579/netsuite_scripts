/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */

define(['N/record', 'N/ui/dialog', 'N/log'], function(record, dialog, log) {
  
    function pageInit(context) {
      try {
        var currentRecord = context.currentRecord;
        var customer = currentRecord.getValue({
          fieldId: 'entity'
        });
  
        if (customer) {
          var customerLookup = record.load({
            type: record.Type.CUSTOMER,
            id: customer
          });
  
          var creditHoldOverride = customerLookup.getValue({
            fieldId: 'creditholdoverride'
          });
  
          if (creditHoldOverride === 'ON') { // Assuming 'T' represents 'on' in the creditholdoverride field
            var warningMessage = "Account has a past due balance. No further orders may be created or service hours scheduled without management approval first.";
            dialog.alert({
              title: 'Warning',
              message: warningMessage
            });
  
            // Log an audit entry
            log.audit({
              title: 'Credit Hold Override Checked',
              details: 'Credit Hold Override value is TRUE for the assigned customer'
            });
          } else {
            log.audit({
              title: 'Credit Hold Override Checked',
              details: 'Credit Hold Override value is FALSE for the assigned customer'
            });
          }
        }
      } catch (e) {
        log.error({
          title: 'Error in Credit Hold Override Check',
          details: e.toString()
        });
      }
    }
  
    return {
      pageInit: pageInit
    };
  
  });
  
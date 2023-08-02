/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */

define(['N/record', 'N/format'], function(record, format) {

    function beforeLoad(context) {
      // Check if the record is being created
      if (context.type === context.UserEventType.CREATE) {
        
        // Check if the record is of the custom form with internal ID '192'
        var customFormId = '192';
        var currentRecord = context.newRecord;
        var currentForm = currentRecord.getValue({ fieldId: 'customform' });
        
        if (currentForm == customFormId) {
          
          // Set the value for 'custbody_tran_term_in_months' field to 12
          currentRecord.setValue({ fieldId: 'custbody_tran_term_in_months', value: 12.0.toFixed(0) });
          
          // Get today's date
          var today = new Date();
        
          // Set the value for 'startdate' field to today's date
          var formattedToday = format.format({ value: today, type: format.Type.DATE });
          currentRecord.setValue({ fieldId: 'startdate', value: formattedToday });
        
          // Calculate and set the value for 'enddate' field (1 year from today)
          var endDate = new Date(today);
          endDate.setFullYear(endDate.getFullYear() + 1);
          var formattedEndDate = format.format({ value: endDate, type: format.Type.DATE });
          currentRecord.setValue({ fieldId: 'enddate', value: formattedEndDate });
        }
      }
    }
    
    return {
      beforeLoad: beforeLoad
    };
  });
  
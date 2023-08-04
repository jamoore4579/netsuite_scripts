/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/log'], function(record, log) {

    function beforeLoad(scriptContext) {
      try {
        if (scriptContext.type === scriptContext.UserEventType.CREATE || scriptContext.type === scriptContext.UserEventType.EDIT) {
          var currentRecord = scriptContext.newRecord;
  
          // Check if the custom form ID is '160'
          if (currentRecord.getValue({ fieldId: 'customform' }) == '158') {
            // Set the value of 'custevent_task_type' field to '101'
            currentRecord.setValue({ fieldId: 'custevent_task_type', value: '101' });

              // Set the initial due date based on vaule '101' 
              var today = new Date();
              var dueDate = new Date();

              // Check if it's Friday (day number 5, as Sunday is day number 0)
              if (today.getDay() === 4) {
                dueDate.setDate(today.getDate() + 3);
              } else {
                dueDate.setDate(today.getDate() + 1);
              }
      
              currentRecord.setValue({
                fieldId: 'duedate',
                value: dueDate
              });
          }
        }
      } catch (error) {
        log.error({
          title: 'Error in BeforeLoad script',
          details: error
        });
      }
    }
  
    return {
      beforeLoad: beforeLoad
    };
  });
  
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
              //var currentDay = today.getDate()

              //log.audit({ title: 'What Day is it?', details: currentDay});

              // Check if it's Thursday (day number 4, as Monday is day number 0)
              if (today.getDay() === 3) {
                dueDate.setDate(today.getDate() + 4); // If Thursday, set due date 4 days later
              } else {
                dueDate.setDate(today.getDate() + 2); // Otherwise, set due date for 2 days out
              }

              // Check if it's Friday (day number 5, as Sunday is day number 0)
              if (today.getDay() === 4) {
                dueDate.setDate(today.getDate() + 4); // If Friday, set due date 4 days later
              } else {
                dueDate.setDate(today.getDate() + 2); // Otherwise, set due date for 2 days out
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
  
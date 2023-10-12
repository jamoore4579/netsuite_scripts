/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */

define(['N/record'], function (record) {
  
    function fieldChanged(context) {
      var currentRecord = context.currentRecord;
      var fieldId = context.fieldId;

      // Check if the current form ID is '149'
      var currentFormId = currentRecord.getValue({ fieldId: 'customform' });
      if (currentFormId !== '149') {
        // Skip the script execution for other forms
        return;
      }
  
      // Check if the field changed is the 'task type' field
      if (fieldId === 'custevent_task_type') {
        var tasktype = currentRecord.getValue({
          fieldId: 'custevent_task_type'
        });
  
        // Set the date based on the task type
        if (tasktype === '104' || tasktype === '107') {
          var today = new Date();
          var dueDate = new Date();

          // Check if it's Friday (day number 5, as Sunday is day number 0)
          if (today.getDay() === 5) {
            dueDate.setDate(today.getDate() + 3); // If Friday, set due date 3 days later
          } else {
            dueDate.setDate(today.getDate() + 1); // Otherwise, set due date for 1 days out
          }
  
          currentRecord.setValue({
            fieldId: 'duedate',
            value: dueDate
          });
        } else if (tasktype === '') {
            var today = new Date();
            var dueDate = new Date();

            // Check if it's Friday (day number 5, as Sunday is day number 0)
            if (today.getDay() === 5) {
                dueDate.setDate(today.getDate()); // If Friday, set due date 4 days later
            } else {
                dueDate.setDate(today.getDate()); // Otherwise, set due date for 2 days out
            }

            currentRecord.setValue({
                fieldId: 'duedate',
                value: dueDate
            });
        }
      }
    }
  
    return {
      fieldChanged: fieldChanged
    };
  });

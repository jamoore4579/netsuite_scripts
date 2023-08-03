/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */

define(['N/record'], function (record) {
  
    function fieldChanged(context) {
      var currentRecord = context.currentRecord;
      var fieldId = context.fieldId;

      // Check if the current form ID is '160'
      var currentFormId = currentRecord.getValue({ fieldId: 'customform' });
      if (currentFormId !== '160') {
        // Skip the script execution for other forms
        return;
      }
  
      // Check if the field changed is the 'task type' field
      if (fieldId === 'custevent_task_type') {
        var tasktype = currentRecord.getValue({
          fieldId: 'custevent_task_type'
        });
  
        // Set the date based on the task type
        if (tasktype === '2') {
          var today = new Date();
          var dueDate = new Date();

          // Check if it's Thursday (day number 3, as Monday is day number 0)
          if (today.getDay() === 3) {
            dueDate.setDate(today.getDate() + 4); // If Thursday, set due date 4 days later
          } else {
            dueDate.setDate(today.getDate() + 2); // Otherwise, set due date for 2 days out
          }

          // Check if it's Friday (day number 4, as Monday is day number 0)
          if (today.getDay() === 4) {
            dueDate.setDate(today.getDate() + 4); // If Friday, set due date 4 days later
          } else {
            dueDate.setDate(today.getDate() + 2); // Otherwise, set due date for 2 days out
          }
  
          currentRecord.setValue({
            fieldId: 'duedate',
            value: dueDate
          });

        } else if (tasktype === '3') {
          var today = new Date();
          var dueDate = new Date();
  
          // Check if it's Thursday (day number 3, as Monday is day number 0)
          if (today.getDay() === 3) {
            dueDate.setDate(today.getDate() + 6); // If Thursday, set due date 4 days later
          } else {
            dueDate.setDate(today.getDate() + 4); // Otherwise, set due date for 2 days out
          }

          // Check if it's Friday (day number 4, as Monday is day number 0)
          if (today.getDay() === 4) {
            dueDate.setDate(today.getDate() + 6); // If Friday, set due date 4 days later
          } else {
            dueDate.setDate(today.getDate() + 4); // Otherwise, set due date for 2 days out
          }
  
          currentRecord.setValue({
            fieldId: 'duedate',
            value: dueDate
          });
        } else if (tasktype === '4') {
          var today = new Date();
          var dueDate = new Date();

          // Check if it's Thursday (day number 3, as Monday is day number 0)
          if (today.getDay() === 3) {
            dueDate.setDate(today.getDate() + 7); // If Thursday, set due date 4 days later
          } else {
            dueDate.setDate(today.getDate() + 4); // Otherwise, set due date for 2 days out
          }

          // Check if it's Friday (day number 4, as Monday is day number 0)
          if (today.getDay() === 4) {
            dueDate.setDate(today.getDate() + 11); // If Friday, set due date 4 days later
          } else {
            dueDate.setDate(today.getDate() + 11); // Otherwise, set due date for 2 days out
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

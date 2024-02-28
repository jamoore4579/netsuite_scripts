/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */

define(['N/record'], function (record) {
  
    function fieldChanged(context) {
      var currentRecord = context.currentRecord;
      var fieldId = context.fieldId;

      //Quote Request Task form ID is 158
      // Check if the current form ID is '158'
      var currentFormId = currentRecord.getValue({ fieldId: 'customform' });
      if (currentFormId !== '158') {
        // Skip the script execution for other forms
        return;
      }
  
      // Check if the field changed is the 'task type' field
      if (fieldId === 'custevent_task_type') {
        var tasktype = currentRecord.getValue({
          fieldId: 'custevent_task_type'
        });
  
        // Set the date based on the task type
        if (tasktype === '101') {
          var today = new Date();
          var dueDate = new Date();

          // Check if it's Thursday (day number 4, as Sunday is day number 0)
          if (today.getDay() === 5) {
            dueDate.setDate(today.getDate() + 3); // If Thursday, set due date 4 days later
          } else {
            dueDate.setDate(today.getDate() + 1); // Otherwise, set due date for 2 days out
          }
  
          currentRecord.setValue({
            fieldId: 'duedate',
            value: dueDate
          });

        } else if (tasktype === '102') {
          var today = new Date();
          var dueDate = new Date();
  
          // Check what is current day, as Sunday is day number 0
          if (today.getDay() === 5) {
            dueDate.setDate(today.getDate() + 6); 
          } else if (today.getDay() === 4) {
            dueDate.setDate(today.getDate() + 6); 
          } else if (today.getDay() === 3) {
            dueDate.setDate(today.getDate() + 6); 
          } else if (today.getDay() === 2) {
            dueDate.setDate(today.getDate() + 6); 
          } else {
            dueDate.setDate(today.getDate() + 4); 
          }
          currentRecord.setValue({
            fieldId: 'duedate',
            value: dueDate
          });

        } else if (tasktype === '103') {
          var today = new Date();
          var dueDate = new Date();

          // Check what is current day, as Sunday is day number 0
          if (today.getDay() === 5) {
            dueDate.setDate(today.getDate() + 11);
          } else if (today.getDay() === 4) {
            dueDate.setDate(today.getDate() + 11); 
          } else if (today.getDay() === 3) {
            dueDate.setDate(today.getDate() + 9); 
          } else if (today.getDay() === 2) {
            dueDate.setDate(today.getDate() + 9); 
          } else {
            dueDate.setDate(today.getDate() + 9);
          }

          currentRecord.setValue({
            fieldId: 'duedate',
            value: dueDate
          });

        } else if (tasktype === '106') {
          var today = new Date();
          var dueDate = new Date();

          // Check if it's Thursday (day number 4, as Sunday is day number 0)
          dueDate.setDate(today.getDate() + 0);

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

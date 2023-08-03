/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */

define(['N/record'], function (record) {
  
    function fieldChanged(context) {
      var currentRecord = context.currentRecord;
      var fieldId = context.fieldId;

      // Check if the current form ID is '157'
      var currentFormId = currentRecord.getValue({ fieldId: 'customform' });
      if (currentFormId !== '157') {
        // Skip the script execution for other forms
        return;
      }
  
      // Check if the field changed is the 'priority' field
      if (fieldId === 'priority') {
        var priority = currentRecord.getValue({
          fieldId: 'priority'
        });
  
        // Check if the priority is set to 'medium'
        if (priority === 'MEDIUM') {
          var today = new Date();
          var dueDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // Adding 7 days (7 * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
  
          currentRecord.setValue({
            fieldId: 'duedate',
            value: dueDate
          });
        } else if (priority === 'HIGH') {
          var today = new Date();
          var dueDate = new Date();
  
          // Check if it's Friday (day number 5, as Sunday is day number 0)
          if (today.getDay() === 5) {
            dueDate.setDate(today.getDate() + 3); // If Friday, set due date 3 days later
          } else {
            dueDate.setDate(today.getDate() + 1); // Otherwise, set due date for the next day
          }
  
          currentRecord.setValue({
            fieldId: 'duedate',
            value: dueDate
          });
        } else if (priority === 'LOW') {
          var today = new Date();
          var dueDate = new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000); // Adding 7 days (7 * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)

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

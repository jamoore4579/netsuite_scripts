/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */

  /**
  * Task Type Internal ID's
  * 104 Order Correction
  * 107 SE Review
  * 108 Product Issue
  * 109 Accounting Issue
  * 110 Return Equipment
  * 111 Credit Memo
  */

define(['N/record'], function (record) {

  function fieldChanged(context) {
    var currentRecord = context.currentRecord;
    var fieldId = context.fieldId;

    // Standard Task Entry form is 149
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

      var today = new Date();
      var dueDate = new Date();

      if (tasktype === '108' || tasktype === '109') {
        // Check if it's Friday (day number 5, as Sunday is day number 0)
        if (today.getDay() >= 3 && today.getDay() <= 5) {
          dueDate.setDate(today.getDate() + 5); // If day 3, 4, or 5, set due date 5 days later
        } else {
          dueDate.setDate(today.getDate() + 3); // Otherwise, set due date for 3 days out
        }

        // Set priority to 'High' for task type 108 or 109
        currentRecord.setValue({
          fieldId: 'priority',
          value: 'HIGH'
        });

      } else if (tasktype === '104' || tasktype === '107') {
        // Check if it's Friday (day number 5, as Sunday is day number 0)
        if (today.getDay() >= 3 && today.getDay() <= 5) {
          dueDate.setDate(today.getDate() + 5); // If day 3, 4, or 5, set due date 5 days later
        } else {
          dueDate.setDate(today.getDate() + 1); // Otherwise, set due date for 3 days out
        }

      } else if (tasktype === '110' || tasktype === '111') {
        // Check if it's Friday (day number 5, as Sunday is day number 0)
        if (today.getDay() >= 3 && today.getDay() <= 5) {
          dueDate.setDate(today.getDate() + 5); // If day 3, 4, or 5, set due date 5 days later
        } else {
          dueDate.setDate(today.getDate() + 3); // Otherwise, set due date for 3 days out
        }

      } else if (tasktype === '') {
        // Check if it's Friday (day number 5, as Sunday is day number 0)
        if (today.getDay() >= 3 && today.getDay() <= 5) {
          dueDate.setDate(today.getDate() + 5); // If day 3, 4, or 5, set due date 5 days later
        } else {
          dueDate.setDate(today.getDate() + 2); // Otherwise, set due date for 2 days out
        }
      }

      // new task are 110 and 111

      currentRecord.setValue({
        fieldId: 'duedate',
        value: dueDate
      });
    }
  }

  return {
    fieldChanged: fieldChanged
  };
});

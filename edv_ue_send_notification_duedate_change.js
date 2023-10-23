/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 * 
 */

// Import required modules
define(['N/record', 'N/email', 'N/runtime'], function (record, email, runtime) {

    function beforeSubmit(context) {
        if (context.type === context.UserEventType.EDIT) {
            var newRecord = context.newRecord;
            var oldRecord = context.oldRecord;

            var newDueDate = newRecord.getValue({ fieldId: 'duedate' });
            var oldDueDate = oldRecord.getValue({ fieldId: 'duedate' });

            if (newDueDate !== oldDueDate) {
                var taskId = newRecord.id;
                var taskCreator = newRecord.getValue({ fieldId: 'owner' });
                var assignee = newRecord.getValue({ fieldId: 'assignee' });
                
                // Build the email message with multiple lines
                var message = 'The due date for task #' + taskId + ' has been changed.\n\n';
                message += 'Task Creator: ' + taskCreator + '\n';
                message += 'New Due Date: ' + newDueDate + '\n';
                message += 'Old Due Date: ' + oldDueDate;

                email.send({
                    author: runtime.getCurrentUser().id,
                    recipients: taskCreator,
                    subject: subject,
                    body: message,
                });
            }
        }
    }

    return {
        beforeSubmit: beforeSubmit
    }
})

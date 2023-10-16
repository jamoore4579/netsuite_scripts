/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
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

                //Send a notification to the task creator
                var recipientEmail = runtime.getCurrentUser().email;
                var subject = 'Task Due Date Changed';
                var message = 'The Due Date for task #' + taskId + ' has ben changed.';

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
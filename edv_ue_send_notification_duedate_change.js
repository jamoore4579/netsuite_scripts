/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */

define(['N/record', 'N/email', 'N/runtime', 'N/format', 'N/url'], function (record, email, runtime, format, url) {

    function hasFieldChanged(newRecord, oldRecord, fieldId) {
        var newValue = newRecord.getValue({ fieldId: fieldId });
        var oldValue = oldRecord.getValue({ fieldId: fieldId });
        return newValue !== oldValue;
    }

    function formatDateWithoutTime(date) {
        return format.format({ value: date, type: format.Type.DATE });
    }

    function sendDueDateChangeNotification(task, taskId, oldDueDate, newDueDate, assignedUser, message) {
        var taskCreator = task.getValue({ fieldId: 'owner' });
        var emailSubject = 'Task Due Date Change Notification';
        var emailBody = 'The due date of a task you created has been changed.<br><br>' +
            'Related Task: <a href="' + generateTaskLink(taskId) + '">Task #' + taskId + '</a><br>' +
            'Original Due Date: ' + oldDueDate + '<br>' +
            'New Due Date: ' + newDueDate + '<br>' +
            'Assigned User: ' + assignedUser + '<br>';

        // Check if a message exists and add it to the email body
        if (message) {
            emailBody += 'Message: ' + message + '<br>';
        }

        // Send the email
        email.send({
            author: runtime.getCurrentUser().id,
            recipients: taskCreator,
            subject: emailSubject,
            body: emailBody,
            isHTML: true // Set the isHTML property to true for HTML content in the email body
        });
    }

    function generateTaskLink(taskId) {
        var taskIdURL = url.resolveRecord({
            recordType: 'task',
            recordId: taskId,
            isEditMode: false,
        });
        return taskIdURL;
    }

    function beforeSubmit(context) {
        if (context.type === context.UserEventType.EDIT) {
            var newTask = context.newRecord;
            var oldTask = context.oldRecord;
            var fieldIdToMonitor = 'duedate';
            var messageField = 'message';

            if (hasFieldChanged(newTask, oldTask, fieldIdToMonitor)) {
                var oldDueDate = formatDateWithoutTime(oldTask.getValue({ fieldId: fieldIdToMonitor }));
                var newDueDate = formatDateWithoutTime(newTask.getValue({ fieldId: fieldIdToMonitor }));
                var assignedUser = newTask.getText({ fieldId: 'assigned' });
                var message = newTask.getValue({ fieldId: messageField });

                if (oldDueDate !== newDueDate) {
                    var taskId = newTask.id; // Retrieving internal ID of the task record
                    sendDueDateChangeNotification(newTask, taskId, oldDueDate, newDueDate, assignedUser, message);
                }
            }
        }
    }

    return {
        beforeSubmit: beforeSubmit
    };
});

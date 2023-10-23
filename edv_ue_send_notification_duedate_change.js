/**
 * NetSuite User Event Script
 * Script Type: User Event
 * Script Deployment: [Your preferred deployment]
 * Description: Monitor task due date changes and notify the task creator.
 */

/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */

define(['N/record', 'N/email', 'N/runtime', 'N/format'], function (record, email, runtime, format) {

    /**
     * Function to check if a field has been changed on a record
     * @param {object} newRecord - The new task record
     * @param {object} oldRecord - The old task record
     * @param {string} fieldId - The ID of the field to check for changes
     * @returns {boolean} - True if the field has changed, false otherwise
     */
    function hasFieldChanged(newRecord, oldRecord, fieldId) {
        var newValue = newRecord.getValue({ fieldId: fieldId });
        var oldValue = oldRecord.getValue({ fieldId: fieldId });
        return newValue !== oldValue;
    }

    /**
     * Function to format a date field without the time component
     * @param {Date} date - The date to format
     * @returns {string} - The formatted date string (without time)
     */
    function formatDateWithoutTime(date) {
        return format.format({ value: date, type: format.Type.DATE });
    }

    /**
     * Function to send an email notification
     * @param {object} task - The updated task record
     * @param {string} oldDueDate - The original due date
     * @param {string} newDueDate - The new due date
     * @param {string} assignedUser - The user assigned to the task
     */
    function sendDueDateChangeNotification(task, oldDueDate, newDueDate, assignedUser) {
        var taskCreator = task.getValue({ fieldId: 'owner' }); // Change to the actual field ID for the task creator
        var emailSubject = 'Task Due Date Change Notification';
        var emailBody = 'The due date of a task has been changed.\n\n';
        emailBody += 'Original Due Date: ' + oldDueDate + '\n';
        emailBody += 'New Due Date: ' + newDueDate + '\n';
        emailBody += 'Assigned User: ' + assignedUser + '\n';

        // Send the email
        email.send({
            author: runtime.getCurrentUser().id,
            recipients: taskCreator,
            subject: emailSubject,
            body: emailBody
        });
    }

    function beforeSubmit(context) {
        if (context.type === context.UserEventType.EDIT) {
            var newTask = context.newRecord;
            var oldTask = context.oldRecord;
            var fieldIdToMonitor = 'duedate'; // Change to the actual field ID for the due date

            if (hasFieldChanged(newTask, oldTask, fieldIdToMonitor)) {
                var oldDueDate = formatDateWithoutTime(oldTask.getValue({ fieldId: fieldIdToMonitor }));
                var newDueDate = formatDateWithoutTime(newTask.getValue({ fieldId: fieldIdToMonitor }));
                var assignedUser = newTask.getText({ fieldId: 'assigned' }); // Change to the actual field ID for the assigned user

                sendDueDateChangeNotification(newTask, oldDueDate, newDueDate, assignedUser);
            }
        }
    }

    return {
        beforeSubmit: beforeSubmit
    };
});

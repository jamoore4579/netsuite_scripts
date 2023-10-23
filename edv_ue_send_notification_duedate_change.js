/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 * 
 */

// Import required modules
define(['N/record', 'N/email', 'N/runtime', 'N/search', 'N/format'], function (record, email, runtime, search, format) {
    
    function beforeSubmit(context) {
        if (context.type === context.UserEventType.EDIT) {
            var newRecord = context.newRecord;
            var oldRecord = context.oldRecord;
            
            // Get the new and old due date values
            var newDueDate = newRecord.getValue({ fieldId: 'duedate' });
            var oldDueDate = oldRecord.getValue({ fieldId: 'duedate' });
            
            // Format the new and old due date values to exclude the time
            newDueDate = format.format({ value: newDueDate, type: format.Type.DATE });
            oldDueDate = format.format({ value: oldDueDate, type: format.Type.DATE });
            
            if (newDueDate !== oldDueDate) {
                var taskId = newRecord.id;
                var taskCreatorId = newRecord.getValue({ fieldId: 'owner' });
                var assigneeId = newRecord.getValue({ fieldId: 'assignee' });
                
                // Get the names of the task creator and assignee
                var taskCreatorName = getEmployeeName(taskCreatorId);
                var assigneeName = getEmployeeName(assigneeId);
                
                // Build the email message with multiple lines
                var message = 'The due date for task #' + taskId + ' has been changed.\n\n';
                message += 'Task Creator: ' + taskCreatorName + '\n';
                message += 'Assigned To: ' + assigneeName + '\n';
                message += 'New Due Date: ' + newDueDate + '\n';
                message += 'Old Due Date: ' + oldDueDate;
                
                // Send a notification to the task creator
                var subject = 'Task Due Date Changed';
                email.send({
                    author: runtime.getCurrentUser().id,
                    recipients: taskCreatorName, // Send the email to the task creator by name
                    subject: subject,
                    body: message,
                });
            }
        }
    }
    
    function getEmployeeName(employeeId) {
        var employeeLookup = search.lookupFields({
            type: search.Type.EMPLOYEE,
            id: employeeId,
            columns: ['entityid'] // 'entityid' represents the employee name
        });
        return employeeLookup.entityid;
    }
    
    // Expose the function to be called before record submission
    return {
        beforeSubmit: beforeSubmit
    };
});

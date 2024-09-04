/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */

define(['N/record', 'N/search', 'N/task', 'N/format', 'N/log'], function (record, search, task, format, log) {

    function execute(context) {
        // Load the saved search
        var savedSearchId = '1031'; // Replace with your saved search ID
        var savedSearch = search.load({ id: savedSearchId });

        // Run the search and process each estimate
        savedSearch.run().each(createTask);
    }

    function createTask(result) {

        var salesOrderId = result.id;

        var serviceRecord = record.load({
            type: record.Type.SALES_ORDER,
            id: salesOrderId,
            isDynamic: false
        });

        var documentNumber = serviceRecord.getValue({
            fieldId: 'tranid'
        });

        var customerId = serviceRecord.getValue({
            fieldId: 'entity'
        });

        // Check if notification already sent
        var checkNotification = serviceRecord.getValue({
            fieldId: 'custbody_training_notification'
        })

        log.audit({
            title: 'Notification Check',
            details: documentNumber + ' ' + checkNotification
        });

        if (checkNotification === false) {

            var taskRecord = record.create({
                type: record.Type.TASK,
                isDynamic: true
            });
    
            // Set task fields
            taskRecord.setValue({
                fieldId: 'title',
                value: 'Training Item found on Approved Sales Order ' + documentNumber
            });
    
            taskRecord.setValue({
                fieldId: 'priority',
                value: 'HIGH'
            });
    
            taskRecord.setValue({
                fieldId: 'message',
                value: 'Sales Order: ' + documentNumber
            });
    
            taskRecord.setValue({
                fieldId: 'company',
                value: customerId // Set the customer (company) on record
            });
    
            taskRecord.setValue({
                fieldId: 'transaction',
                value: serviceRecord.id
            });

            taskRecord.setValue({
                fieldId: 'assigned',
                value: 1657
            });
    
            taskRecord.setValue({
                fieldId: 'custevent_task_type',
                value: 112 // Set the task type on record
            });
    
            // Save the task record
            var taskId = taskRecord.save();
    
            // Log audit information
            log.audit({
                title: 'Task Created',
                details: 'Task ID: ' + taskId + ', Opportunity ID: ' + serviceRecord.id + ', Tran ID: ' + documentNumber
            });

            // Mark the notification as sent to avoid sending it again
            record.submitFields({
                type: 'salesOrder',
                id: result.id,
                values: {
                    custbody_training_notification: true
                }
            });

        } else {
            log.debug({
                title: 'Notification Check',
                details: 'Notification Already Sent.' 
            });
        }

        return true;
    }

    return {
        execute: execute
    };
});

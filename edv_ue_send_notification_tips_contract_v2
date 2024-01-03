/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */

define(['N/log', 'N/record', 'N/task'], function(log, record, task) {

    /**
     * @param {Object} context
     * @param {Record} context.newRecord - New record
     * @param {Record} context.oldRecord - Old record
     * @param {string} context.type - Trigger type
     */
    function afterSubmit(context) {

        // Check if the event type is afterSubmit and if the record is being edited
        if (context.type === context.UserEventType.EDIT || context.type === context.UserEventType.CREATE) {
            
            // Get the new record
            var newRecord = context.newRecord;

            // Check if notification already sent
            var checkNotification = newRecord.getValue({
                fieldId: 'custbody_contract_notification'
            });

            log.debug({
                title: 'Notification Check',
                details: checkNotification
            });
            
            // Retrieve the value of the field custbody_purchasing_contract_nation
            var nationFieldValues = newRecord.getValue({
                fieldId: 'custbody_purchasing_contract_nation'
            });

            log.debug({
                title: 'Contract Text',
                details: nationFieldValues
            });

            // Get the transaction ID
            var transactionId = newRecord.getValue({
                fieldId: 'tranid'
            });

            var salesRep = newRecord.getValue({
                fieldId: 'salesrep'
            });

            if (checkNotification === false) {
                // Check if nationFieldValues corresponds to values 4 through 12 and include corresponding text in the email body
                if (nationFieldValues >= 4 && nationFieldValues <= 12) {
                    var emailBody = 'Notification message for Sales Order: ' + transactionId + '\n';

                    // Check nationFieldValues for specific cases and add corresponding additional information to the email body
                    if (nationFieldValues == 4) {
                        emailBody += 'Additional Information: TIPS 200904 – Audio Visual Equipment, Supplies and Services\n';
                    } else if (nationFieldValues == 5) {
                        emailBody += 'Additional Information: TIPS 210902 – Classroom and Teaching Aids Goods and Services\n';
                    } else if (nationFieldValues == 6) {
                        emailBody += 'Additional Information: TIPS 200601 – Consulting and Other Related Services\n';
                    } else if (nationFieldValues == 7) {
                        emailBody += 'Additional Information: TIPS 210103 – Copiers, Fax, Multifunction Machines and Services\n';
                    } else if (nationFieldValues == 8) {
                        emailBody += 'Additional Information: TIPS 200301 – Furniture, Furnishings and Services\n';
                    } else if (nationFieldValues == 9) {
                        emailBody += 'Additional Information: TIPS 21050301 – Networking Equipment, Software and Services\n';
                    } else if (nationFieldValues == 10) {
                        emailBody += 'Additional Information: TIPS 220105 – Technology Solutions Products and Services\n';
                    } else if (nationFieldValues == 11) {
                        emailBody += 'Additional Information: TIPS 210303 – Telephone and Communications Data Systems and Solutions\n';
                    } else if (nationFieldValues == 12) {
                        emailBody += 'Additional Information: TIPS 200306 – Vaping Sensors\n';
                    }

                    // Create a scheduled task to send email after 10 seconds
                    var scheduledTask = task.create({
                        taskType: task.TaskType.SCHEDULED_SCRIPT
                    });

                    scheduledTask.scriptId = 'customscript_contract_notification'; // Replace with your scheduled script ID for sending emails
                    scheduledTask.deploymentId = 'customdeploy_contract_notific'; // Replace with your scheduled script deployment ID
                    scheduledTask.params = {
                        author: salesRep,
                        recipient: 'jmoore@weendeavor.com',
                        subject: 'TIPS Purchasing Contract Transaction ' + transactionId,
                        body: emailBody
                    };
                    scheduledTask.delayInSeconds = 10; // 10 seconds delay

                    try {
                        var taskId = scheduledTask.submit();
                        log.debug({
                            title: 'Scheduled Task Created',
                            details: 'Email will be sent after 10 seconds.' + taskId
                        });

                        // Mark the notification as sent to avoid sending it again (optional: can be moved to the scheduled script)
                        record.submitFields({
                            type: newRecord.type,
                            id: newRecord.id,
                            values: {
                                custbody_contract_notification: true
                            }
                        });

                    } catch (submitError) {
                        log.error({
                            title: 'Error Submitting Task',
                            details: submitError
                        });
                    }
                    
                } else {
                    log.debug({
                        title: 'Condition Not Met',
                        details: 'Notification should not be sent.'
                    });
                }
            } else {
                log.debug({
                    title: 'Notification Check',
                    details: 'Notification Already Sent.' 
                });
            }
        }
    }

    return {
        afterSubmit: afterSubmit
    };
});

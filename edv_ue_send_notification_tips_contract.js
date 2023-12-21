/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(['N/log', 'N/email', 'N/record'], function(log, email, record) {

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
            var checkNotification = newRecord.getValue ({
                fieldId: 'custbody_contract_notification'
            })

            log.debug({
                title: 'Notification Check',
                details: checkNotification
            });
            
            // Check if the field custbody_purchasing_contract_nation has a value
            var nationFieldValues = newRecord.getValue({
                fieldId: 'custbody_purchasing_contract_nation'
            });

            var nationFieldText = newRecord.getText({
                fieldId: 'custbody_purchasing_contract_nation'
            });

            // Get the transaction ID
            var transactionId = newRecord.getValue({
                fieldId: 'tranid'
            });

            var salesRep = newRecord.getValue({
                fieldId: 'salesrep'
            })

            log.debug({
                title: 'Nation Field Value',
                details: nationFieldValues
            });

            // Modified condition to check if nationFieldValues is 4, 5, 6, 7, 8, 9, 10, 11, or 12
            if (nationFieldValues >= 4 && nationFieldValues <= 12) {

                var emailBody = 'Notification message for Sales Order:' + transactionId + '\n';
                emailBody += 'Purchasing Contract: ' + nationFieldText

                // Send email to user 3578
                email.send({
                    author: salesRep, // The internal ID of the user sending the email
                    recipients: 'jmoore@weendeavor.com', // Replace with the actual email address of user 3578
                    subject: 'Notification for Transaction ' + transactionId,
                    body: emailBody
                });

                log.debug({
                    title: 'Condition Met',
                    details: 'Notification was sent.'
                });

                // Mark the notification as sent to avoid sending it again
                record.submitFields({
                    type: newRecord.type,
                    id: newRecord.id,
                    values: {
                        custbody_contract_notification: true
                    }
                });
            } else {
                log.debug({
                    title: 'Condition Not Met',
                    details: 'Notification should not be sent.'
                });
            }
        }

    }

    return {
        afterSubmit: afterSubmit
    };

});

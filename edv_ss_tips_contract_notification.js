/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', 'N/email'], function(record, search, email) {

    function execute(context) {
        // Load the saved search to retrieve the estimates
        var savedSearchId = '3278'; // Replace with your saved search ID
        var savedSearch = search.load({ id: savedSearchId });
    
        // Run the search and process each estimate
        savedSearch.run().each(contractNotification);
      }

      function contractNotification(result) {

        var salesOrderId = result.id

        var contractRecord = record.load({
            type: record.Type.SALES_ORDER,
            id: salesOrderId,
            isDynamic: true // Load the record in edit mode
        });

        var documentNumber = contractRecord.getValue({
            fieldId: 'tranid'
        })

        var salesRep = contractRecord.getValue({
            fieldId: 'salesrep'
        });

        // Retrieve the value of the field custbody_purchasing_contract_nation
        var nationFieldValues = result.getValue({
            name: 'custbody_purchasing_contract_nation'
        });

        // Check if notification already sent
        var checkNotification = contractRecord.getValue({
            fieldId: 'custbody_contract_notification'
        });

        log.debug({
            title: 'Notification Check',
            details: documentNumber + ' ' + checkNotification
        });

        if (checkNotification === false) {
            
            // Check if nationFieldValues corresponds to values 4 through 12 and include corresponding text in the email body
            if (nationFieldValues >= 4 && nationFieldValues <= 12) {

                var emailBody = 'Notification message for Sales Order: ' + documentNumber + '\n';

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

                // Send email to user 3578
                email.send({
                    author: salesRep, // The internal ID of the user sending the email
                    recipients: 'jmoore@weendeavor.com', // Replace with the actual email address of user 3578
                    subject: 'TIPS Purchasing Contract Transaction ' + documentNumber,
                    body: emailBody
                });

                log.debug({
                    title: 'Email Sent',
                    details: 'Email sent for Sales Order: ' + documentNumber
                });

                // Mark the notification as sent to avoid sending it again
                record.submitFields({
                    type: 'salesOrder',
                    id: result.id,
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
})
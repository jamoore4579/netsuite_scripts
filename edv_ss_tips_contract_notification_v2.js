/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 */
define(['N/search', 'N/log', 'N/email', 'N/record'], function (search, log, email, record) {

    function execute(context) {
        try {
            // Load the saved search
            var savedSearchId = '2133';
            var savedSearch = search.load({
                id: savedSearchId
            });

            // Run the search
            var resultSet = savedSearch.run();

            // Iterate over the result set
            resultSet.each(function (result) {
                // Retrieve values from the result
                var documentNumber = result.getValue({
                    name: 'tranid'
                });

                log.debug({
                    title: 'Document Number',
                    details: documentNumber
                });

                var salesRep = result.getValue({
                    name: 'salesrep'
                });

                log.debug({
                    title: 'Sales Rep',
                    details: salesRep
                });

                var nationFieldValues = result.getValue({
                    name: 'custbody_purchasing_contract_nation'
                });

                log.debug({
                    title: 'Contract',
                    details: nationFieldValues
                });

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

                    // Send email to user 1685
                    email.send({
                        author: salesRep,
                        recipients: 1685 || 3578,
                        subject: 'TIPS Purchasing Contract Transaction ' + documentNumber,
                        body: emailBody
                    });

                    log.debug({
                        title: 'Email Sent',
                        details: 'Email sent for Sales Order: ' + documentNumber
                    });

                    //Mark the notification as sent to avoid sending it again
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

                // Continue processing next result
                return true;
            });

        } catch (e) {
            log.error({
                title: 'Error',
                details: 'An error occurred: ' + e
            });
        }
    }

    return {
        execute: execute
    };

});
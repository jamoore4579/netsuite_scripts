/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 */
define(['N/search', 'N/log', 'N/email', 'N/record'], function (search, log, email, record) {

    function execute(context) {
        try {
            // Load the saved search
            var savedSearchId = '3278';
            var savedSearch = search.load({ id: savedSearchId });

            // Run the search
            var resultSet = savedSearch.run();
            resultSet.each(function (result) {
                // Get values from the search result
                var documentNumber = result.getValue({ name: 'tranid' });
                var salesRep = result.getValue({ name: 'salesrep' });
                var nationFieldValues = result.getValue({ name: 'custbody_purchasing_contract_nation' });

                // Check if the nationFieldValues is between 4 and 12
                if (nationFieldValues >= 4 && nationFieldValues <= 12) {
                    // Build email body
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

                    // Send email
                    email.send({
                        author: salesRep,
                        recipients: 'jmoore@weendeavor.com',
                        subject: 'TIPS Purchasing Contract Transaction ' + documentNumber,
                        body: emailBody
                    });

                    log.debug({
                        title: 'Email Sent',
                        details: 'Email sent for Sales Order: ' + documentNumber
                    });

                    // Update record to set custbody_contract_notification to true
                    record.submitFields({
                        type: record.Type.SALES_ORDER,
                        id: result.id,
                        values: {
                            custbody_contract_notification: true
                        },
                        options: {
                            enableSourcing: false,
                            ignoreMandatoryFields: true
                        }
                    });
                }

                return true; // Continue processing next result
            });

        } catch (error) {
            log.error({
                title: 'Error Processing Script',
                details: error
            });
        }
    }

    return {
        execute: execute
    };

});
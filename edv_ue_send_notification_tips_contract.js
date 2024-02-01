/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 */
define(['N/email', 'N/search', 'N/log'], function(email, search, log) {

    function execute(context) {

        // Load the saved search with internal ID '3278'
        var savedSearchId = '3278';

        var savedSearch = search.load({
            id: savedSearchId
        });

        // Run the saved search
        var resultSet = savedSearch.run();

        resultSet.each(function (result) {

            // Get values from the result
            var tranId = result.getValue({
                name: 'tranid'
            });
            var salesRep = result.getText({
                name: 'salesrep'
            });

            // Log the values
            log.debug({
                title: 'Record Processed',
                details: 'Tran ID: ' + tranId + ', Sales Rep: ' + salesRep
            });

            // Send an email
            sendEmail(tranId, salesRep);
        })
    }

    function sendEmail(tranId, salesRep) {
        // Customize the email subject and body as needed
        var subject = 'Record Processed: ' + tranId;
        var body = 'Transaction ID: ' + tranId + '\nSales Rep: ' + salesRep;

        // Replace with the recipient email address
        var recipientEmail = 3578;

        // Send the email
        email.send({
            author: -5, // NetSuite user internal ID who sends the email
            recipients: recipientEmail,
            subject: subject,
            body: body
        });

        log.debug({
            title: 'Email Sent',
            details: 'Email sent for Tran ID: ' + tranId
        });
    }

    return {
        execute: execute
    };

});

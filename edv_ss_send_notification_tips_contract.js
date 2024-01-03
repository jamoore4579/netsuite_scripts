/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 */

define(['N/email', 'N/task'], function(email, task) {

    /**
     * Definition of the scheduled script trigger point.
     *
     * @param {Object} scriptContext
     * @param {string} scriptContext.type - Script execution context. Use scriptContext.executionContext to determine the specific operation that triggered this script.
     */
    function execute(scriptContext) {
        try {
            var params = scriptContext.scriptId; // Retrieve parameters from the scheduled task

            // Extract parameters
            var author = params.author;
            var recipient = params.recipient;
            var subject = params.subject;
            var body = params.body;

            // Send email
            email.send({
                author: author,
                recipients: recipient,
                subject: subject,
                body: body
            });

            log.debug({
                title: 'Email Sent',
                details: 'Email sent successfully.'
            });
        } catch (error) {
            log.error({
                title: 'Error Sending Email',
                details: error
            });
        }
    }

    return {
        execute: execute
    };
});

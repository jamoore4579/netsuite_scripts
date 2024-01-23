/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(['N/log', 'N/record', 'N/error'], 
    function(log, record, error) {

        /**
         * @param {Object} context
         * @param {Record} context.newRecord - New record
         * @param {string} context.type - Trigger type
         * @param {string} context.executionContext - Execution context
         */
        function afterSubmit(context) {
            try {
                // Check if the event type is 'create'
                if (context.type === context.UserEventType.CREATE) {
                    // Get the new record
                    var newRecord = context.newRecord;

                    // Get the transaction ID (tranid) and customer name
                    var tranId = newRecord.getValue({
                        fieldId: 'tranid'
                    });

                    var customerName = newRecord.getText({
                        fieldId: 'entity'
                    });

                    // Log the transaction ID and customer name
                    log.debug({
                        title: 'Transaction Info',
                        details: 'Transaction ID: ' + tranId + ', Customer Name: ' + customerName
                    });
                }
            } catch (e) {
                // Handle exceptions and log errors
                log.error({
                    title: 'Error in User Event Script',
                    details: e.toString()
                });

                // Throw the exception again to prevent the record from being saved
                throw error.create({
                    name: 'USER_EVENT_SCRIPT_ERROR',
                    message: 'An error occurred in the User Event Script. Check the script log for details.'
                });
            }
        }

        return {
            afterSubmit: afterSubmit
        };

    });

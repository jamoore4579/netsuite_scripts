/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */

define(['N/search', 'N/record', 'N/log'], function (search, record, log) {
    
    /**
     * Main function for the scheduled script
     */
    function execute() {
        try {
            // Define your saved search ID
            var savedSearchId = '1839';

            // Load the saved search
            var mySearch = search.load({
                id: savedSearchId
            });

            // Run the search and process the results
            mySearch.run().each(function (result) {
                try {
                    // Get the record ID from the search result
                    var recordId = result.id;

                    // Load the record by ID
                    var myRecord = record.load({
                        type: record.Type.ESTIMATE,
                        id: recordId,
                    });

                    // Update the fields
                    myRecord.setValue('entitystatus', 14);
                    myRecord.setValue('custbody_lost_reason', 8);
                    myRecord.setValue('custbodyproduct_service_quote', 4);

                    // Save the record
                    var recordIdAfterUpdate = myRecord.save();

                    // Log the results
                    log.audit('Record Updated', 'Record ID: ' + recordIdAfterUpdate);
                } catch (e) {
                    log.error('Error Updating Record', e.message);
                }

                // Continue processing the next result
                return true;
            });
        } catch (e) {
            log.error('Error', e.message);
        }
    }

    return {
        execute: execute
    };
});

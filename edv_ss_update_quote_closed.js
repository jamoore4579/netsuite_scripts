/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */

define(['N/search', 'N/record', 'N/log'], function (search, record, log) {

    function updateRecords() {
        try {
            // Define the saved search internal ID
            var savedSearchId = '1839';

            // Load the saved search
            var searchObj = search.load({
                id: savedSearchId
            });

            // Run the saved search
            searchObj.run().each(function (result) {
                // Get the internal ID of the record
                var recordId = result.id;

                // Update the record
                var recordType = result.recordType;

                // Create an object with fields to update
                var fieldsToUpdate = {
                    status: 14,
                    custbody_lost_reason: 6
                };

                // Update the record using submitFields
                var recordIdAfterUpdate = record.submitFields({
                    type: recordType,
                    id: recordId,
                    values: fieldsToUpdate
                });

                // Log the results
                if (recordIdAfterUpdate) {
                    log.audit('Record Updated', 'Record ID: ' + recordIdAfterUpdate);
                } else {
                    log.error('Record Update Failed', 'Record ID: ' + recordId);
                }

                return true; // Continue processing additional records
            });

        } catch (e) {
            log.error('Error', e.message);
        }
    }

    return {
        execute: updateRecords
    };
});

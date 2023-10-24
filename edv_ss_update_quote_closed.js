/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */

define(['N/search', 'N/record', 'N/log'], function (search, record, log) {

    function execute(context) {
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

                // Check if custbodyproduct_service_quote field has no value and set it to 4
                var serviceQuoteValue = result.getValue('custbodyproduct_service_quote');
                if (!serviceQuoteValue) {
                    // Use the record module to update the record
                    var recordObj = record.load({
                        type: recordType,
                        id: recordId
                    });
                    recordObj.setValue('custbodyproduct_service_quote', 4);
                    recordObj.save(); // Save the updated record
                    updated = true;
                }

                // Continue processing additional records
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

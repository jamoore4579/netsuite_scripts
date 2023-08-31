/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */

define(['N/search', 'N/record', 'N/log'], function (search, record, log) {

    // Define the saved search internal ID from which records will be pulled.
    var savedSearchId = '1766';

    // Define the internal ID of the new Sales Rep user.
    var newSalesRepUserId = '1681'; // Replace with the actual user ID.

    function updateSalesRepRole() {
        // Load the saved search.
        var savedSearch = search.load({
            id: savedSearchId
        });

        // Run the search and process the results.
        savedSearch.run().each(function (result) {
            try {
                // Get the internal ID of the record.
                var recordId = result.id;
                
                // Get the record type dynamically from the result.
                var recordType = result.recordType;

                // Load the record.
                var currentRecord = record.load({
                    type: recordType,
                    id: recordId
                });

                // Set the Sales Rep field with the new user ID.
                currentRecord.setValue({
                    fieldId: 'salesrep',
                    value: newSalesRepUserId
                });

                // Save the record.
                var recordIdAfterUpdate = currentRecord.save();

                // Log an audit entry.
                log.audit({
                    title: 'Sales Rep Updated',
                    details: recordType + ' Record ID ' + recordIdAfterUpdate + ' Sales Rep set to User ID ' + newSalesRepUserId
                });
            } catch (e) {
                // Handle errors if any.
                log.error({
                    title: 'Error Updating Sales Rep',
                    details: e.toString()
                });
            }

            // Continue processing the next result.
            return true;
        });
    }

    // Entry point for the scheduled script.
    function execute(context) {
        updateSalesRepRole();
    }

    // Define script exports (no code here).
    return {
        execute: execute
    };
});

/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */

define(['N/search', 'N/record', 'N/log'], function(search, record, log) {

    /**
     * Definition of the scheduled script's main function.
     */
    function execute(context) {
        try {
            // Define the ID of the saved search you want to use
            var savedSearchId = '1608';

            // Load the saved search
            var savedSearch = search.load({
                id: savedSearchId
            });

            // Run the saved search
            savedSearch.run().each(function(result) {
                var recordType = result.recordType;
                var recordId = result.id;

                // Load the Sales Order record
                var salesOrder = record.load({
                    type: recordType,
                    id: recordId
                });

                // Get the current document number
                var documentNumber = salesOrder.getValue({
                    fieldId: 'tranid'
                });

                // Update the status to Pending Fulfillment
                salesOrder.setValue({
                    fieldId: 'orderstatus',
                    value: 'B' // 'B' corresponds to Pending Fulfillment
                });

                // Set the 'custbody_system_approved' field to 'Supply Chain'
                salesOrder.setValue({
                    fieldId: 'custbody_system_approved',
                    value: 1
                });

                // Save the updated record
                salesOrder.save();

                // Log an audit entry about the update
                log.audit({
                    title: 'Sales Order Status Update',
                    details: 'Sales Order ' + documentNumber + ' status updated from Pending Approval to Pending Fulfillment.'
                });

                return true; // Continue processing the next result
            });
        } catch (e) {
            log.error({
                title: 'Script Error',
                details: e.toString()
            });
        }
    }

    // Return the function to be executed in the scheduled script
    return {
        execute: execute
    };

});

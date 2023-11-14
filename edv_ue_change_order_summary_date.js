/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */

define(['N/record'], function(record) {

    function afterSubmit(context) {
        var newRecord = context.newRecord;
        var oldRecord = context.oldRecord;

        // Get the current value of the custbody_change_summary field
        var newSummary = newRecord.getValue({
            fieldId: 'custbody_change_summary'
        });

        log.audit('New Summary: ' + newSummary)

        // Get the previous value of the custbody_change_summary field
        var oldSummary = oldRecord.getValue({
            fieldId: 'custbody_change_summary'
        });

        log.audit('Old Summary: ' + oldSummary)

        // Check if the custbody_change_summary field has been modified
        if (newSummary !== oldSummary) {
            // If modified, update the custom date field with the current timestamp
            record.submitFields({
                type: newRecord.type,
                id: newRecord.id,
                values: {
                    'custbody_last_change_date': new Date()
                },
                options: {
                    enableSourcing: false,
                    ignoreMandatoryFields: true
                }
            });
        }
    }

    return {
        afterSubmit: afterSubmit
    };

});

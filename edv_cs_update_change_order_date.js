/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */

define(['N/currentRecord', 'N/format', 'N/log'], function(currentRecord, format, log) {

    function saveRecord(context) {
        try {
            var currentRec = context.currentRecord;
            var changeSummary = currentRec.getValue({
                fieldId: 'custbody_change_summary'
            });

            if (changeSummary) {
                var currentDate = new Date();
                var formattedDate = format.format({
                    value: currentDate,
                    type: format.Type.DATE
                });

                var lastChangeDate = currentRec.getValue({
                    fieldId: 'custbody_last_change_date'
                });

                if (!lastChangeDate || lastChangeDate !== formattedDate) {
                    currentRec.setValue({
                        fieldId: 'custbody_last_change_date',
                        value: formattedDate
                    });

                    // Log an audit trail for date update
                    log.audit({
                        title: 'Last Change Date Updated',
                        details: 'Last Change Date was updated to: ' + formattedDate
                    });
                }

            } else {
                // Log if no change summary data is present
                log.audit({
                    title: 'No Change Summary Data',
                    details: 'No change summary data was present.'
                });
            }
        } catch (e) {
            // Display an error message if something goes wrong
            var errorMessage = 'An error occurred: ' + e.message;
            log.error({
                title: 'Script Error',
                details: errorMessage
            });
        }

        return true;
    }

    return {
        saveRecord: saveRecord
    };
});

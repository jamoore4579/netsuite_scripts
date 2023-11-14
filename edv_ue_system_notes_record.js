/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(['N/log', 'N/record'], function (log, record) {

    /**
     * @param {Object} context
     * @param {UserEventContext.afterSubmit} context.newRecord
     */
    function afterSubmit(context) {
        try {
            // Get the new record
            var newRecord = context.newRecord;

            // Check if the transaction has system notes
            if (newRecord.isDynamic && newRecord.getLineCount({
                sublistId: 'systemnotes'
            }) > 0) {

                // Loop through system notes
                for (var i = 0; i < newRecord.getLineCount({
                    sublistId: 'systemnotes'
                }); i++) {

                    // Get system note field and type
                    var field = newRecord.getSublistValue({
                        sublistId: 'systemnotes',
                        fieldId: 'field',
                        line: i
                    });
                    var type = newRecord.getSublistValue({
                        sublistId: 'systemnotes',
                        fieldId: 'type',
                        line: i
                    });

                    // Check if the field is custbody_change_summary and type is set
                    if (field === 'custbody_change_summary' && type === 'S') {
                        // Log the new value
                        log.audit({
                            title: 'System Note Change Summary',
                            details: 'New Value: ' + newRecord.getSublistValue({
                                sublistId: 'systemnotes',
                                fieldId: 'newvalue',
                                line: i
                            })
                        });
                    }
                }
            }

        } catch (e) {
            log.error({
                title: 'Error in User Event Script',
                details: e.toString()
            });
        }
    }

    return {
        afterSubmit: afterSubmit
    };

});

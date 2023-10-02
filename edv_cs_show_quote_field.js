/**
* @NApiVersion 2.x
* @NScriptType ClientScript
* @NModuleScope SameAccount
*/

define(['N/record', 'N/ui/message', 'N/log'], function (record, message, log) {

    function pageInit(context) {
        // Get the current record
        var currentRecord = context.currentRecord;

        // Get the record type
        var recordType = currentRecord.type;

        // Log the record type to the console
        log.debug('Record Type', recordType);

        // Hide the custom field 'custevent_quote_num'
        currentRecord.getField({ fieldId: 'custevent_quote_num' }).isDisplay = false;
    }

    return {
        pageInit: pageInit
    };

});

/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */

define(['N/record', 'N/currentRecord'], function (record, currentRecord) {

    function pageInit(context) {
        // This function runs when the record is in edit mode.

        // Get the current record
        var currentRec = currentRecord.get();

        // Get the custom form value
        var customForm = currentRec.getValue({
            fieldId: 'customform'
        });

        // Get the time sheet value
        var timeSheetValue = currentRec.getValue({
            fieldId: 'timesheet'
        });

        // Get the time sheet value
        var totalHoursValue = currentRec.getValue({
            fieldId: 'totalhours'
        });

        // Log the custom form and time sheet value to the console
        console.log('Custom Form: ' + customForm);
        console.log('Time Sheet Value: ' + timeSheetValue);
        console.log('Total Hours Value: ' + totalHoursValue)
    }

    return {
        pageInit: pageInit
    };
});

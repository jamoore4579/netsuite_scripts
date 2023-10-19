/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */

define(['N/record', 'N/log', 'N/ui/dialog', 'N/format'], function (record, log, dialog, format) {
    function saveRecord (context) {
        try {
            var currentRecord = context.currentRecord;
            var lineCount = currentRecord.getLineCount({ sublistId: 'item' });
            var canSave = true; // Flag to track if the record can be saved

            for (var i = 0; i < lineCount; i++) {
                var item = currentRecord.getSublistText({ sublistId: 'item', fieldId: 'item', line: i });
                var isRenewable = currentRecord.getSublistValue({ sublistId: 'item', fieldId: 'custcol_ctc_renewable_item', line: i });
                var renewalDate = currentRecord.getSublistValue({ sublistId: 'item', fieldId: 'custcol_ctc_renewal_date', line: i });

                var formattedDate = renewalDate ? format.format({ value: renewalDate, type: format.Type.DATE }) : 'No renewal date set';

                var logDetails = 'Item Name: ' + item + ', Renewable Item: ' + (isRenewable ? 'True' : 'False') +
                    ', Renewal Date: ' + formattedDate;

                log.audit({
                    title: 'Item Audit',
                    details: logDetails
                });

                // Check if renewal date is null for a renewable item
                if (isRenewable && !renewalDate) {
                    canSave = false; // Prevent the record from being saved
                    break; // Exit the loop if a problem is found
                }
            }

            if (!canSave) {
                // Display an alert to the user and prevent the record from saving
                var alertOptions = {
                    title: 'Validation Error',
                    message: 'Cannot save the record because some renewable items have no renewal date.'
                };
                dialog.alert(alertOptions);

                // Return false to prevent the record from saving
                return false;
            }
        } catch (e) {
            log.error({
                title: 'Error',
                details: e.toString()
            });
        }

        // If no problems were found, allow the record to save
        return true;
    }

    return {
        saveRecord: saveRecord // Add the validation to the saveRecord event
    };
});

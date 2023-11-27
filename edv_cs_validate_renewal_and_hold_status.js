/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */

define(['N/record', 'N/log', 'N/ui/dialog', 'N/format', 'N/ui/message'], function (record, log, dialog, format, message) {

    function saveRecord(context) {
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

            var onHoldStatus = currentRecord.getValue({ fieldId: 'custbody_on_hold_status' });
            var readyForBilling = currentRecord.getValue({ fieldId: 'custbody_readyforbilling' });

            if ((onHoldStatus === '1' || onHoldStatus === '2' || onHoldStatus === '3' || onHoldStatus === '4') && readyForBilling === '2') {
                // Prevent saving the record
                var errorMessage = 'Record is in On Hold Status and not ready to be billed';

                // Show a pop-up message to the user
                dialog.alert({
                    title: 'Error',
                    message: errorMessage
                });

                // Return false to prevent saving
                return false;
            }

            // Allow saving the record if conditions are not met
            return true;

        } catch (e) {
            // Handle any errors that occur
            log.error({
                title: 'Error Occurred',
                details: e.toString()
            });

            var errorMessage = message.create({
                title: 'Error',
                message: 'An error occurred. Please contact support.'
            });
            errorMessage.show();

            // Prevent saving in case of an error
            return false;
        }
    }

    return {
        saveRecord: saveRecord
    };
});

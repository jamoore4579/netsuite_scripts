/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */

 define(['N/record', 'N/ui/message', 'N/log', 'N/ui/dialog'], function(record, message, log, dialog) {

    function pageInit(context) {
        // Add your page initialization logic here
    }

    function saveRecord(context) {
        try {
            var currentRecord = context.currentRecord;

            // Get values of custbody_on_hold_status and custbody_readyforbilling fields
            var onHoldStatus = currentRecord.getValue({
                fieldId: 'custbody_on_hold_status'
            });

            var readyForBilling = currentRecord.getValue({
                fieldId: 'custbody_readyforbilling'
            });

            // Log the values of custbody_on_hold_status and custbody_readyforbilling
            log.debug({
                title: 'On Hold Status Field Value',
                details: onHoldStatus
            });

            log.debug({
                title: 'Ready for Billing Field Value',
                details: readyForBilling
            });

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
                details: e
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
        pageInit: pageInit,
        saveRecord: saveRecord
    };

});

/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */

define(['N/record', 'N/currentRecord'], function (record, currentRecord) {

    function pageInit(context) {
        try {
            var currentRecordObj = currentRecord.get();
            var billingClass = currentRecordObj.getValue({
                fieldId: 'billingclass'
            });

            if (billingClass == 5) {
                currentRecordObj.setValue({
                    fieldId: 'custentity_billing_rate',
                    value: 100.00
                });
                currentRecordObj.setValue({
                    fieldId: 'custentity_cost_rate',
                    value: 80.00
                });
            }

        } catch (e) {
            console.error('An error occurred: ' + e);
        }
    }

    return {
        pageInit: pageInit
    };
});

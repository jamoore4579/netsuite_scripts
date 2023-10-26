/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */

define(['N/record', 'N/currentRecord'], function (record, currentRecord) {

    function pageInit(context) {
        var currentRecord = context.currentRecord;

        // Get the Billing Class from the Employee record
        var billingClass = currentRecord.getValue({
            fieldId: 'billingclass'
        });

        console.log('Billing Class: ' + billingClass);

        // Check if billing class value is 1
        if (billingClass === '1') {
            // Retrieve the field name value of ID 1 from customrecord653
            var customRecordId = 1;
            var customRecordType = 'customrecord653';

            var customRecordLookup = search.lookupFields({
                type: customRecordType,
                id: customRecordId,
                columns: ['name']
            })

            var fieldNameValue = customRecordLookup.fieldname;

            if (fieldNameValue) {
                console.log('Billing Class Value is 1. Field Name Value: ' + fieldNameValue);
            }
        }
    }

    return {
        pageInit: pageInit
    };
});

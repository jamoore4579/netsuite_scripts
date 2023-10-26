/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */

define(['N/record', 'N/currentRecord'], function (record, currentRecord) {

    function pageInit(context) {
        // Function only runs in edit mode

        //Get the current record
        var currentRec = currentRecord.get();

        //Get the custom form value
        var recordName = currentRec.getValue({
            fieldId: 'name'
        })

        console.log('Record Name: ' + recordName);

        //Get the custom form value
        var billRate = currentRec.getValue({
            fieldId: 'custrecord_tech_bill_rate'
        })

        console.log('Billing Rate: ' + billRate);

        //Get the custom form value
        var costRate = currentRec.getValue({
            fieldId: 'custrecord_tech_cost_rate'
        })

        console.log('Cost Rate: ' + costRate);
    }

    return {
        pageInit: pageInit
    }
})
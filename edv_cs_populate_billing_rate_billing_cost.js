/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/record'],
function (currentRecord, record) {
    
    function pageInit(context) {
        // Get the current record
        var currentRecordObj = currentRecord.get();
        
        // Get the value of the "billingclass" field
        var billingClass = currentRecordObj.getValue({
            fieldId: 'billingclass'
        });
        
        // Define an array of billing classes and their corresponding custom record IDs
        var billingClasses = {
            1: 1,
            2: 2,
            3: 3,
            4: 4,
            5: 5,
            6: 6,
            7: 7,
            8: 8
        };
        
        if (billingClasses.hasOwnProperty(billingClass)) {
            var customRecordId = billingClasses[billingClass];
            var customRecordType = 'customrecord653';
            
            var customRecordLookup = record.load({
                type: customRecordType,
                id: customRecordId,
                isDynamic: true
            });

            var techRateValue = customRecordLookup.getValue({
                fieldId: 'name'
            });

            var billRateValue = customRecordLookup.getValue({
                fieldId: 'custrecord_tech_bill_rate'
            });

            var costRateValue = customRecordLookup.getValue({
                fieldId: 'custrecord_tech_cost_rate'
            });
            
            if (techRateValue) {
                console.log('Billing Class Value is ' + billingClass + '. Field Name Value: ' + techRateValue);
                console.log('Project Rates - Bill: ' + billRateValue + ' Cost: ' + costRateValue);
            }
        }
    }

    return {
        pageInit: pageInit
    };
});

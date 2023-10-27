/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/record'],

function (currentRecord, record) {

    function pageInit(context) {
        try {
            // Get the current record
            var currentRecordObj = currentRecord.get();
            var billingClass = currentRecordObj.getValue({ fieldId: 'billingclass' });

            // Define an object for billing classes and their corresponding custom record IDs
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

            if (billingClasses[billingClass]) {
                var customRecordId = billingClasses[billingClass];
                var customRecordType = 'customrecord653';

                var customRecordLookup = record.load({
                    type: customRecordType,
                    id: customRecordId,
                    isDynamic: true
                });

                var billRateValue = customRecordLookup.getValue({ fieldId: 'custrecord_tech_bill_rate' });
                var costRateValue = customRecordLookup.getValue({ fieldId: 'custrecord_tech_cost_rate' });

                if (billRateValue && costRateValue) {
                    console.log('Billing Class Value is ' + billingClass);
                    console.log('Project Rates - Bill: ' + billRateValue + ' Cost: ' + costRateValue);

                    // Set the values for custentity_billing_rate and custentity_cost_rate fields
                    currentRecordObj.setValue({ fieldId: 'custentity_billing_rate', value: billRateValue });
                    currentRecordObj.setValue({ fieldId: 'custentity_cost_rate', value: costRateValue });
                }
            }
        } catch (e) {
            console.error('An error occurred: ' + e.message);
        }
    }

    function fieldChanged(context) {

        if (context.fieldId === 'billingclass') {

            try {
                var currentRecordObj = currentRecord.get();
                var billingClass = currentRecordObj.getValue({ fieldId: 'billingclass' });

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

                if (billingClasses[billingClass]) {
                    var customRecordId = billingClasses[billingClass];
                    var customRecordType = 'customrecord653';

                    var customRecordLookup = record.load({
                        type: customRecordType,
                        id: customRecordId,
                        isDynamic: true
                    });

                    var billRateValue = customRecordLookup.getValue({ fieldId: 'custrecord_tech_bill_rate' });
                    var costRateValue = customRecordLookup.getValue({ fieldId: 'custrecord_tech_cost_rate' });

                    if (billRateValue && costRateValue) {
                        console.log('Billing Class Value is ' + billingClass);
                        console.log('Project Rates - Bill: ' + billRateValue + ' Cost: ' + costRateValue);

                        currentRecordObj.setValue({ fieldId: 'custentity_billing_rate', value: billRateValue });
                        currentRecordObj.setValue({ fieldId: 'custentity_cost_rate', value: costRateValue });
                    }
                }

            
            } catch (e) {
                console.error('An error occurred: ' + e.message);
            }
        }
    }


    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged
    };
});

/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */

define(['N/log', 'N/record'], function(log, record) {

    function saveRecord(context) {
        try {
            
            var currentRecord = context.currentRecord;
            var customFormId = currentRecord.getValue({
                fieldId: 'customform'
            });

            var documentNumber = currentRecord.getValue({
                fieldId: 'tranid'
            })

            if (customFormId === '143' || customFormId === '191') {

                var lineCount = currentRecord.getLineCount({
                    sublistId: 'item'
                });

                var totalAmount = 0;

                for (var i = 0; i < lineCount; i++) {
                    var itemName = currentRecord.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'item_display',
                        line: i
                    });

                    if (itemName !== 'description') {
                        var quantity = currentRecord.getSublistValue({
                          sublistId: 'item',
                          fieldId: 'quantity',
                          line: i
                        });

                        var cost = currentRecord.getSublistValue({
                            sublistId: 'item',
                            fieldId: 'costestimaterate',
                            line: i
                        });

                        totalAmount += quantity * cost;
                    }
                }

                currentRecord.setValue({
                    fieldId: 'custbody_item_total_cost',
                    value: totalAmount.toFixed(2)
                });

                log.audit({ title: 'Audit Log', details: 'Total Cost: ' + totalAmount.toFixed(2) })

            } else if (customFormId === '180') {

                var lineCount = currentRecord.getLineCount({
                    sublistId: 'item'
                });

                var totalAmount = 0;

                for (var i = 0; i < lineCount; i++) {
                    var itemName = currentRecord.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'item_display',
                        line: i
                    });

                    if (itemName !== '*') {
                        var quantity = currentRecord.getSublistValue({
                          sublistId: 'item',
                          fieldId: 'quantity',
                          line: i
                        });

                        var cost = currentRecord.getSublistValue({
                            sublistId: 'item',
                            fieldId: 'costestimaterate',
                            line: i
                        });

                        totalAmount += quantity * cost;
                    }
                }

                currentRecord.setValue({
                    fieldId: 'custbody_item_total_cost',
                    value: totalAmount.toFixed(2)
                });

                log.audit({ title: 'Audit Log', details: 'Total Cost: ' + totalAmount.toFixed(2) })

            }

            return true; // Allows the record to be saved
        
        } catch (error) {
            log.error({
                title: 'Error in saveRecord',
                details: 'An error occurred: ' + error.message
            });

            return false; // Prevents the record from being saved
        }
    }

    return {
        saveRecord: saveRecord
    }
})
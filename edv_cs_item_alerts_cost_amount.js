/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope Public
 */

define(['N/log', 'N/record', 'N/currentRecord', 'N/ui/dialog', 'N/runtime'], function (log, record, currentRecord, dialog, runtime) {

    function pageInit(context) {
        // This function runs when the page is initialized
    }

    function sublistChanged(context) {
        // This function runs when there is a change in a sublist
        var currentRecordObj = currentRecord.get();
        
        // Check if the sublist is the 'item' sublist
        if (context.sublistId === 'item') {
            // Get the line number of the added record
            var lineCount = currentRecordObj.getLineCount({
                sublistId: 'item'
            });

            // The line number of the added record is the last line
            var lineNumber = lineCount - 1;

            // Get the internal ID of the added item
            var itemInternalId = currentRecordObj.getSublistValue({
                sublistId: 'item',
                fieldId: 'item',
                line: lineNumber
            });

            // Log a message to the console with line number and item_display value
            log.debug({
                title: 'Record Line Added',
                details: 'Record line added to the item sublist, Line Number: ' + lineNumber + ', Item Value: ' + itemInternalId
            });

            // Check if the added item has an internal ID of 5828
            if (itemInternalId == 5828) {
                showPopup('There is a known issue with the Mitel 6940w IP Phone that is unresolved.  Do NOT quote this without Byron’s approval first.');
            }
        }
    }

    // Display a pop-up
    function showPopup (msgText) {
        dialog.alert({
            title: 'Warning',
            message: msgText
        })
    }

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

                log.audit({ title: 'Audit Log', details: 'Transaction: ' + documentNumber })
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

    // Add event handlers
    return {
        pageInit: pageInit,
        sublistChanged: sublistChanged,
        saveRecord: saveRecord
    };

});

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

            //Determine which custom form is being used
            if (customFormId ==='163') {

                var lineCount = currentRecord.getLineCount({
                    sublistId: 'item'
                })

                var totalAmount = 0;
                var costAmount = 0;
                var quoteDiff = 0;
                var quoteMargin = 0;

                for (var i = 0; i < lineCount; i++) {

                    var itemType = currentRecord.getSublistValue ({
                        sublistId: 'item',
                        fieldId: 'itemtype',
                        line: i
                    })

                    if (itemType !== 'Service') {
                        var quantity = currentRecord.getSublistValue({
                          sublistId: 'item',
                          fieldId: 'quantity',
                          line: i
                        });
              
                        var rate = currentRecord.getSublistValue({
                          sublistId: 'item',
                          fieldId: 'rate',
                          line: i
                        });

                        var cost = currentRecord.getSublistValue({
                            sublistId: 'item',
                            fieldId: 'costestimaterate',
                            line: i
                          });
              
                        totalAmount += quantity * rate;
                        costAmount += quantity * cost;
                        quoteDiff = totalAmount - costAmount
                        quoteMargin = (quoteDiff / totalAmount)*100
                    }
                }

                currentRecord.setValue({
                    fieldId: 'custbody_quote_margin',
                    value: quoteMargin.toFixed(0)
                });

                log.audit({ title: 'Audit Log', details: 'Doc #: ' + documentNumber + ', Total Amount: ' + totalAmount.toFixed(2) });
                log.audit({ title: 'Audit Log', details: 'Doc #: ' + documentNumber + ', Total Cost: ' + costAmount.toFixed(2)});
                log.audit({ title: 'Audit Log', details: 'Doc #: ' + documentNumber + ', Quote Margin: ' + quoteMargin.toFixed(0) });

            } else if (customFormId === '181') {

                var lineCount = currentRecord.getLineCount({
                    sublistId: 'item'
                })

                var totalAmount = 0;
                var costAmount = 0;
                var quoteDiff = 0;
                var quoteMargin = 0;

                for (var i = 0; i < lineCount; i++) {
                    
                    var itemName = currentRecord.getSublistValue ({
                        sublistId: 'item',
                        fieldId: 'item_display',
                        line: i
                    })

                    if (itemName !== 'description' || itemName !== '*') {
                        var quantity = currentRecord.getSublistValue({
                          sublistId: 'item',
                          fieldId: 'quantity',
                          line: i
                        });
              
                        var rate = currentRecord.getSublistValue({
                          sublistId: 'item',
                          fieldId: 'custcol_syn_erateamount',
                          line: i
                        });

                        var cost = currentRecord.getSublistValue({
                            sublistId: 'item',
                            fieldId: 'costestimaterate',
                            line: i
                          });
              
                        totalAmount += quantity * rate;
                        costAmount += quantity * cost;
                        quoteDiff = totalAmount - costAmount
                        quoteMargin = (quoteDiff / totalAmount)*100
                    }
                }

                currentRecord.setValue({
                    fieldId: 'custbody_quote_margin',
                    value: quoteMargin.toFixed(0)
                });

                log.audit({ title: 'Audit Log', details: 'Doc #: ' + documentNumber + ', Total Amount: ' + totalAmount.toFixed(2) });
                log.audit({ title: 'Audit Log', details: 'Doc #: ' + documentNumber + ', Total Cost: ' + costAmount.toFixed(2)});
                log.audit({ title: 'Audit Log', details: 'Doc #: ' + documentNumber + ', Quote Margin: ' + quoteMargin.toFixed(0) }); 
          
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

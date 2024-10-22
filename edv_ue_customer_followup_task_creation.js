/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */

define(['N/record', 'N/log', 'N/task', 'N/search'], function (record, log, task, search) {

    function afterSubmit(context) {
        var curRecord = context.newRecord;

        // Check if values are not populated
        var subStatus = curRecord.getValue({ fieldId: 'custbody_quote_sub_status' });
        var documentNumber = curRecord.getValue({ fieldId: 'tranid' });
        var memo = curRecord.getValue({ fieldId: 'memo' });
        var totalAmount = curRecord.getValue({ fieldId: 'total' });
        var salesRep = curRecord.getValue({ fieldId: 'salesrep' });

        // If key values like document number or total are missing, reload the record
        if (!documentNumber || !totalAmount) {
            try {
                log.audit({
                    title: 'Reloading Record',
                    details: 'Values were missing, reloading the record for accurate data.'
                });

                // Reload the current estimate record to ensure all values are populated
                curRecord = record.load({
                    type: record.Type.ESTIMATE,
                    id: curRecord.id,
                    isDynamic: false
                });

                // Now retrieve the values again
                subStatus = curRecord.getValue({ fieldId: 'custbody_quote_sub_status' });
                documentNumber = curRecord.getValue({ fieldId: 'tranid' });
                memo = curRecord.getValue({ fieldId: 'memo' });
                totalAmount = curRecord.getValue({ fieldId: 'total' });
                salesRep = curRecord.getValue({ fieldId: 'salesrep' });

            } catch (e) {
                log.error({
                    title: 'Error Reloading Record',
                    details: e.message
                });
                return; // Exit the function if we fail to reload
            }
        }

        // Log the retrieved values for reference
        log.audit({
            title: 'Retrieved Values',
            details: 'Sub Status: ' + subStatus + ', Document Number: ' + documentNumber +
                ', Memo: ' + memo + ', Total: ' + totalAmount + ', Sales Rep: ' + salesRep
        });

        // Add logic to check if the record has been edited
        var oldRecord = context.oldRecord;
        var isEdited = false;
        if (oldRecord) {
            var oldSubStatus = oldRecord.getValue({ fieldId: 'custbody_quote_sub_status' });
            var oldMemo = oldRecord.getValue({ fieldId: 'memo' });
            var oldTotalAmount = oldRecord.getValue({ fieldId: 'total' });
            var oldSalesRep = oldRecord.getValue({ fieldId: 'salesrep' });

            isEdited = (subStatus !== oldSubStatus || memo !== oldMemo || totalAmount !== oldTotalAmount || salesRep !== oldSalesRep);
        }

        log.audit({
            title: 'Record Edited',
            details: 'Record Edited: ' + isEdited
        });

        // Check if subStatus has the internal ID of 7 and there is a sales rep
        if (subStatus === '7' && salesRep && isEdited) {
            var taskExists = checkForExistingTask(documentNumber);

            if (!taskExists) {
                try {
                    var taskRecord = record.create({
                        type: record.Type.TASK,
                        isDynamic: true
                    });

                    log.audit({
                        title: 'Creating Task',
                        details: 'Setting task fields for Document Number: ' + documentNumber
                    });

                    taskRecord.setValue({
                        fieldId: 'title',
                        value: 'Follow up on Estimate# ' + documentNumber
                    });

                    taskRecord.setValue({
                        fieldId: 'company',
                        value: curRecord.getValue({ fieldId: 'entity' })
                    });

                    taskRecord.setValue({
                        fieldId: 'message',
                        value: 'Memo: ' + (memo || 'No memo') + ', Total: $' + totalAmount
                    });

                    taskRecord.setValue({
                        fieldId: 'transaction',
                        value: curRecord.id
                    });

                    taskRecord.setValue({
                        fieldId: 'custevent_task_type',
                        value: 114
                    });

                    taskRecord.setValue({
                        fieldId: 'assigned',
                        value: salesRep
                    });

                    var currentDate = new Date();
                    var dueDate = addBusinessDays(currentDate, 5);
                    taskRecord.setValue({
                        fieldId: 'duedate',
                        value: dueDate
                    });

                    log.audit({
                        title: 'Task Values',
                        details: {
                            title: 'Follow up on Estimate# ' + documentNumber,
                            company: curRecord.getValue({ fieldId: 'entity' }),
                            message: 'Memo: ' + (memo || 'No memo') + ', Total: $' + totalAmount,
                            task_type: 114,
                            assigned: salesRep,
                            duedate: dueDate,
                            transaction: curRecord.id
                        }
                    });

                    var taskId = taskRecord.save({
                        enableSourcing: true,
                        ignoreMandatoryFields: false
                    });

                    log.audit({
                        title: 'Task Created',
                        details: 'Task ID: ' + taskId + ', Estimate ID: ' + curRecord.id + ', Document Number: ' + documentNumber
                    });

                } catch (e) {
                    log.audit({
                        title: 'Error Creating Task',
                        details: e.message + ' - Stack: ' + e.stack
                    });
                }
            } else {
                log.audit({
                    title: 'Task Already Exists',
                    details: 'A follow-up task already exists for Estimate# ' + documentNumber
                });
            }
        } else {
            log.audit({
                title: 'Task Not Created',
                details: 'Conditions not met or record not edited. Sub Status: ' + subStatus + ', Sales Rep: ' + salesRep
            });
        }
    }

    function checkForExistingTask(documentNumber) {
        var taskSearch = search.create({
            type: search.Type.TASK,
            filters: [
                ['title', 'is', 'Follow up on Estimate# ' + documentNumber]
            ],
            columns: ['internalid']
        });

        var taskExists = false;
        taskSearch.run().each(function(result) {
            taskExists = true;
            return false;
        });
        return taskExists;
    }

    function addBusinessDays(date, days) {
        var result = new Date(date);
        var count = 0;
        while (count < days) {
            result.setDate(result.getDate() + 1);
            if (result.getDay() !== 0 && result.getDay() !== 6) {
                count++;
            }
        }
        return result;
    }

    return {
        afterSubmit: afterSubmit
    };

});

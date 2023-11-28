/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */

define(['N/record', 'N/log', 'N/task'],

    function (record, log, task) {

        /**
         * @param {Object} context
         * @param {UserEventContext} context.newRecord - New record
         */

        function afterSubmit(context) {
            

            // Get the new record
            var newRecord = context.newRecord;

            // Check if the custbody_deal_registration field is checked
            var isDealRegistration = newRecord.getValue({
                fieldId: 'custbody_deal_registration'
            });

            // Check if the task has already been created for this record
            var taskCreated = newRecord.getValue({
                fieldId: 'custbody_deal_task_created'
            })

            if (isDealRegistration && !taskCreated) {
                try {
                    // Load the current record to get additional information
                    var opportunityRecord = record.load({
                        type: record.Type.OPPORTUNITY,
                        id: newRecord.id,
                        isDynamic: false
                    });

                    // Get the customer (company) ID
                    var customerId = opportunityRecord.getValue({
                        fieldId: 'entity'
                    });

                    // Load the customer record to retrieve address information
                    var customerRecord = record.load({
                        type: record.Type.CUSTOMER,
                        id: customerId,
                        isDynamic: false
                    });

                    // Get the state from the customer's address (assuming the first address in the list)
                    var state = customerRecord.getValue({
                        fieldId: 'billstate',
                    });

                    // Log the state information
                    log.audit({
                        title: 'Customer State',
                        details: 'Customer ID: ' + customerId + ', State: ' + state
                    });

                    // Get the transaction ID (tranid) from the Opportunity record
                    var transactionNumber = opportunityRecord.getValue({
                        fieldId: 'tranid'
                    });

                    // Check if the transactionNumber is a valid value
                    if (transactionNumber) {
                        // Create a task record
                        var taskRecord = record.create({
                            type: record.Type.TASK,
                            isDynamic: true
                        });

                        // Set task fields
                        taskRecord.setValue({
                            fieldId: 'title',
                            value: 'Please create a Deal Registration for this Opportunity record in ' + state + '.'
                        });

                        taskRecord.setValue({
                            fieldId: 'priority',
                            value: 'HIGH'
                        });

                        //taskRecord.setValue({
                            //fieldId: 'transaction',
                            //value: transactionNumber
                        //});

                        taskRecord.setValue({
                            fieldId: 'message',
                            value: 'Opportunity: #' + transactionNumber
                        })

                        taskRecord.setValue({
                            fieldId: 'company',
                            value: customerId // Set the customer (company) on record
                        });

                        taskRecord.setValue({
                            fieldId: 'custevent_task_type',
                            value: 105 // Set the task type on record
                        });

                        // Set the assigned user ID based on the state
                        if (state != 'MS') {
                            taskRecord.setValue({
                                fieldId: 'assigned',
                                value: 5063
                            });
                        } else if (state === 'MS') {
                            taskRecord.setValue({
                                fieldId: 'assigned',
                                value: 5062
                            });
                        }

                        var today = new Date();
                        var dueDate = new Date();

                        if (today.getDay() === 5) {
                            dueDate.setDate(today.getDate() + 3);
                        } else {
                            dueDate.setDate(today.getDate() + 1);
                        }

                        taskRecord.setValue({
                            fieldId: 'duedate',
                            value: dueDate // Set the due date
                        });

                        // Save the task record
                        var taskId = taskRecord.save();

                        // Update the custom field to indicate that the task has been created
                        record.submitFields({
                            type: record.Type.OPPORTUNITY,
                            id: newRecord.id,
                            values: {
                                custbody_deal_task_created: true
                            },
                            options: {
                                enableSourcing: false,
                                ignoreMandatoryFields: true
                            }
                        });

                        // Log audit information
                        log.audit({
                            title: 'Task Created',
                            details: 'Task ID: ' + taskId + ', Opportunity ID: ' + newRecord.id + ', Tran ID: ' + transactionNumber
                        });

                    } else {
                        // Log an error if transactionNumber is not valid
                        log.error({
                            title: 'Invalid Transaction Number',
                            details: 'Transaction ID is not valid for Opportunity ID: ' + newRecord.id
                        });
                    }

                } catch (e) {
                    log.error({
                        title: 'Error Creating Task',
                        details: e
                    });
                }
            } else if (!isDealRegistration) {
                // Log audit information if custbody_deal_registration is false
                log.audit({
                    title: 'Task Not Created',
                    details: 'Task creation skipped because custbody_deal_registration is false for Opportunity ID: ' + newRecord.id
                });
            } else if (taskCreated) {
                // Log audit information if task has already been created for this record
                log.audit({
                    title: 'Task Already Created',
                    details: 'Task creation skipped because a task has already been created for Opportunity ID: ' + newRecord.id
                });
            }
        }

        return {
            afterSubmit: afterSubmit
        };

    });

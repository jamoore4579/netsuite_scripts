/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */

define(['N/currentRecord', 'N/record', 'N/log', 'N/ui/message'],
    function(currentRecord, record, log, message) {

        function pageInit(context) {
            try {
                var currentRec = currentRecord.get();
                var customerId = currentRec.getValue({
                    fieldId: 'entity'
                });

                if (customerId) {
                    fetchCustomerInformation(customerId);

                    return false;
                }

                return true;

            } catch (error) {
                log.error({
                    title: 'Error in pageInit',
                    details: error
                });
            }
        }

        function fieldChanged(context) {
            try {
                var currentRec = context.currentRecord;
                var fieldId = context.fieldId;

                if (fieldId === 'entity') {
                    var customerId = currentRec.getValue({
                        fieldId: 'entity'
                    });

                    if (customerId) {
                        fetchCustomerInformation(customerId);
                    }
                }
            } catch (error) {
                log.error({
                    title: 'Error in fieldChanged',
                    details: error
                });
            }
        }

        function fetchCustomerInformation(customerId) {
            var customerRecord = record.load({
                type: record.Type.CUSTOMER,
                id: customerId
            });

            var creditHoldOverride = customerRecord.getValue({
                fieldId: 'creditholdoverride'
            });
            var daysOverdue = customerRecord.getValue({
                fieldId: 'daysoverdue'
            });
            var overdueBalance = customerRecord.getValue({
                fieldId: 'overduebalance'
            });

            // Logging retrieved values
            log.debug({
                title: 'Customer ID',
                details: customerId
            });
            log.debug({
                title: 'Credit Hold Override',
                details: creditHoldOverride
            });
            log.debug({
                title: 'Days Overdue',
                details: daysOverdue
            });
            log.debug({
                title: 'Overdue Balance',
                details: overdueBalance
            });

            // Display pop-up if conditions met
            if (
                creditHoldOverride === 'AUTO' &&
                daysOverdue >= 90 &&
                overdueBalance > 0
            ) {
                var alertMessage = 'Customer on Credit Hold. Overdue Balance: $' + overdueBalance;
                window.alert(alertMessage);
            }
        }

        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged
        };
    }
);

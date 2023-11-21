/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */

define(['N/log', 'N/currentRecord', 'N/record'],
    function (log, currentRecord, record) {
        function pageInit(context) {
            log.debug("PAGEINIT START");

            var currentRecord = context.currentRecord;
            var customFormId = currentRecord.getValue({
                fieldId: 'customform'
            });

            console.log(customFormId);
        }

        return {
            pageInit: pageInit
        }

    })
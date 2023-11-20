/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @ModuleScope SameAccount
 */

define(['N/log', 'N/record'], function (log, record) {
  
    function pageInit(context) {
        log.debug({
            title: 'Script Initialized',
            details: 'Script initialized successfully.'
        });
    }
    
    function saveRecord(context) {
      try {

        log.debug({
            title: 'Save Record Triggered',
            details: 'Save record function triggered successfully.'
        })
        var currentRecord = context.currentRecord;
  
        var lineCount = currentRecord.getLineCount({
          sublistId: 'item'
        });
  
        for (var i = 0; i < lineCount; i++) {
          var itemName = currentRecord.getSublistValue({
            sublistId: 'item',
            fieldId: 'item_display',
            line: i
          });
  
  
          log.audit({
            title: 'Item',
            details: 'Item Display Value: ' + itemName
          });

          return true; // Allows the record to be saved

        }
      } catch (e) {
        log.error({
          title: 'Error in script',
          details: e
        });

        return false; // Prevents the record from being saved
      }
    }
  
    return {
        pageInit: pageInit,
        saveRecord: saveRecord
    };
  });
  
/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/ui/dialog', 'N/record'], function(currentRecord, dialog, record) {
    
    /**
     * Function to check if the current record is an Estimate record.
     * @returns {boolean} true if the current record is an Estimate, false otherwise.
     */
    function isEstimateRecord() {
        var recordType = currentRecord.get().type;
        return (recordType === 'estimate');
    }
    
    /**
     * Function to make the 'Quote #' field required.
     */
    function makeQuoteFieldRequired() {
        var quoteField = currentRecord.get().getField({
            fieldId: 'custevent_quote_num'
        });
        quoteField.isMandatory = true;
    }
    
    /**
     * Function to set the 'Quote #' field value with the document number from the Estimate record.
     */
    function setQuoteFieldValue() {
        var estimateRecord = currentRecord.get();
        var quoteField = estimateRecord.getField({
            fieldId: 'tranid' // Replace with the actual field ID of the document number in the Estimate record
        });
        
        var taskRecord = currentRecord.get();
        var taskQuoteField = taskRecord.getField({
            fieldId: 'custevent_quote_num' // Replace with the actual field ID of the 'Quote #' field in the Task record
        });
        
        if (quoteField && taskQuoteField) {
            var documentNumber = quoteField.getText(); // Assuming the document number is a text field
            taskQuoteField.setValue(documentNumber);
        }
    }
    
    /**
     * Page Init function
     */
    function pageInit(context) {
        if (context.mode === 'create' && isEstimateRecord()) {
            makeQuoteFieldRequired();
            setQuoteFieldValue();
        }
    }
    
    return {
        pageInit: pageInit
    };
});

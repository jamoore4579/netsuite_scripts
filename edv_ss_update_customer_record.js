/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */
define(['N/search', 'N/record'], function (search, record) {
    function execute(context) {
      // Load the Saved Search
      var savedSearchId = '1670'; // ID of your Saved Search
      var mySearch = search.load({ id: savedSearchId });
  
      // Run the Saved Search
      var resultSet = mySearch.run();
  
      // Process the results
      resultSet.each(function (result) {
        var recordId = result.getValue({ name: 'internalid' });
  
        try {
          // Update the 'terms' field to 'Due on receipt' (Internal ID: 1)
          record.submitFields({
            type: 'CUSTOMER', // Replace with the record type you want to update
            id: recordId,
            values: {
              'terms': '4' // Replace '1' with the internal ID of the 'Due on receipt' term
            }
          });
  
          // Log the change
          log.audit({
            title: 'Record Updated',
            details: 'Record ID: ' + recordId + ', Terms: Due on receipt'
          });
  
        } catch (e) {
          log.error('Error updating record ' + recordId, e.message);
          return true; // Continue processing other records even if one fails
        }
  
        return true;
      });
    }
  
    return {
      execute: execute
    };
  });
  
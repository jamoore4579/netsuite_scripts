/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 */

define(['N/search', 'N/record'], function(search, record) {

    function execute(context) {
      try {
        // Load the saved search
        var savedSearchId = '1144'; // Saved Search ID
        var savedSearch = search.load({ id: savedSearchId });
  
        // Run the saved search
        var searchResult = savedSearch.run().getRange({ start: 0, end: 6000 });
  
        // Iterate through the search results
        for (var i = 0; i < searchResult.length; i++) {
          var result = searchResult[i];
  
          // Get the record type and internal ID from the search result
          var recordType = result.recordType;
          var recordId = result.id;
  
          // Load the record
          var loadedRecord = record.load({ type: recordType, id: recordId });
  
          // Update the record fields as needed
          //loadedRecord.setValue({ fieldId: 'custrecord_custom_field', value: 'New Value' }); // Replace with your field ID and value
  
          // Save the record
          try {
            var savedRecordId = loadedRecord.save();
            log.audit('Record Updated', 'Record Type: ' + recordType + ', Record ID: ' + savedRecordId);
          } catch (e) {
            log.error('Error Saving Record', 'Record Type: ' + recordType + ', Record ID: ' + recordId + ', Error: ' + e.message);
          }
        }
      } catch (ex) {
        log.error('Error Executing Script', ex.message);
      }
    }
  
    return {
      execute: execute
    };
  });
  
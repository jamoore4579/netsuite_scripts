/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */
define(['N/search', 'N/record'], function (search, record) {
  function execute(context) {
    // Load the Saved Search by its ID (Replace 'savedsearch_customers' with the actual ID of your saved search)
    var savedSearchId = '2598';
    var customerSearch = search.load({ id: savedSearchId });

    // Run the search and process the results
    customerSearch.run().each(function (result) {
      // Get the customer internal ID
      var customerId = result.getValue({ name: 'internalid' });

      try {
        // Update the custom category field on the customer record to 'K-12'
        record.submitFields({
          type: record.Type.CUSTOMER,
          id: customerId,
          values: {
            category: ['110'],
          },
          options: {
            enableSourcing: false,
            ignoreMandatoryFields: true,
          },
        });

        // Log successful updates (audit)
        log.audit({
          title: 'Customer Updated',
          details: 'Customer ID: ' + customerId,
        });

        return true; // Continue processing additional results
      } catch (e) {
        // Log errors (audit)
        log.error({
          title: 'Error Updating Customer',
          details: 'Customer ID: ' + customerId + '. Error: ' + e.message,
        });
        
        return true; // Continue processing additional results
      }
    });
  }

  return {
    execute: execute
  };
});

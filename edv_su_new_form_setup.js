/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */

define(['N/ui/serverWidget', 'N/record'], function (serverWidget, record) {
    function onRequest(context) {
      if (context.request.method === 'GET') {
        // Create a form
        var form = serverWidget.createForm({
          title: 'Custom Form with Vendor and Item Fields'
        });
  
        // Add a Vendor list/record field
        var vendorField = form.addField({
          id: 'custpage_vendor',
          type: serverWidget.FieldType.SELECT,
          label: 'Vendor'
        });
  
        // Populate the Vendor list/record field with "MITEL" and "DELL" as options
        vendorField.addSelectOption({
          value: 'mitel',
          text: 'MITEL'
        });
  
        vendorField.addSelectOption({
          value: 'dell',
          text: 'DELL'
        });
  
        // Add an Item free-form field
        var itemField = form.addField({
          id: 'custpage_item',
          type: serverWidget.FieldType.TEXT,
          label: 'Item'
        });
  
        // Add a Submit button
        form.addSubmitButton({
          label: 'Submit'
        });
  
        // Display the form
        context.response.writePage(form);
      } else if (context.request.method === 'POST') {
        // Handle form submission
        var vendor = context.request.parameters.custpage_vendor;
        var item = context.request.parameters.custpage_item;
  
        // Create a new record (replace 'customrecord_your_record_type' with your custom record type)
        var newRecord = record.create({
          type: 'customrecord_deal_registration', // Replace with your custom record type
        });
  
        // Set field values
        newRecord.setValue({
          fieldId: 'custpage_vendor', // Replace with the actual field ID for Vendor on your custom record
          value: vendor
        });
  
        newRecord.setValue({
          fieldId: 'custpage_item', // Replace with the actual field ID for Item on your custom record
          value: item
        });
  
        // Save the new record
        var newRecordId = newRecord.save();
  
        // Redirect to a success page or show a success message
        context.response.write('Record created with ID: ' + newRecordId);
      }
    }
  
    return {
      onRequest: onRequest
    };
  });
  
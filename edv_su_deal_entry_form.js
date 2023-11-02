/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope Public
 */

define(['N/ui/serverWidget', 'N/currentRecord', 'N/record'], function (serverWidget, currentRecord, record) {

    function onRequest(context) {
        if (context.request.method === 'GET') {
            // Create a form
            var form = serverWidget.createForm({
                title: 'Custom Record 654 Entry Form'
            });

            // Add a hidden field for record identification
            form.addField({
                id: 'custpage_record_id',
                type: serverWidget.FieldType.TEXT,
                label: 'Record ID'
            }).updateDisplayType({
                displayType: serverWidget.FieldDisplayType.HIDDEN
            });

            // Retrieve the related Opportunity field value (replace with the actual field ID)
            var relatedOpportunity = 'Sample Related Opportunity Value';

            // Add a field to display the related Opportunity field value
            form.addField({
                id: 'custpage_related_opportunity',
                type: serverWidget.FieldType.TEXT,
                label: 'Related Opportunity'
            }).defaultValue = relatedOpportunity;

            // Add "Save" and "Cancel" buttons
            form.addSubmitButton({
                label: 'Save'
            });

            // Add a cancel button and associated JavaScript to close the window
            var cancelButton = form.addButton({
                id: 'custpage_cancel_button',
                label: 'Cancel'
            });

            // Include client script to close the window
            cancelButton.clientScriptFileId = 24316; // Replace with the actual file ID of your client script

            // Write the response
            context.response.writePage(form);
        } else if (context.request.method === 'POST') {
            // Handle form submission
            var customFieldId = 'custrecord_custom_field_id'; // Replace with your custom field internal ID

            // Retrieve the custom field value from the submitted form data
            var customFieldValue = context.request.parameters[customFieldId];

            // Here, you can use customFieldValue to update or create your custom record
            // ...

            // Redirect to a success page or back to the custom record
            context.response.sendRedirect({
                type: serverWidget.RedirectType.RECORD,
                identifier: customRecordId // Replace with the correct identifier
            });
        }
    }

    return {
        onRequest: onRequest
    };
});

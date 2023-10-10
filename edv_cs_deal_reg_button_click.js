/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */

define(['N/record', 'N/ui/dialog'], function (record, dialog) {
    function createCustomRecord() {
        try {
            // Create a new custom record
            var customRecord = record.create({
                type: 'customrecord651', // Set the record type to your custom record type
                isDynamic: true,
            });

            // Set field values as needed
            customRecord.setValue({
                fieldId: 'custrecord_vendor', // Replace with the actual field ID
                value: 'Dell' // Replace with the desired field value
            });

            customRecord.setValue({
                fieldId: 'custrecord_cust_poc', // Replace with the actual field ID
                value: 'Endeavor' // Replace with the desired field value
            });

            customRecord.setValue({
                fieldId: 'custrecord_sales_rep', // Replace with the actual field ID
                value: 'Sara Brents' // Replace with the desired field value
            });

            // Save the custom record
            var customRecordId = customRecord.save();
            
            // Show a confirmation dialog
            dialog.alert({
                title: 'Success',
                message: 'New custom record created with ID: ' + customRecordId
            });
        } catch (e) {
            // Handle any errors
            dialog.alert({
                title: 'Error',
                message: 'An error occurred: ' + e.message
            });
        }
    }

    function pageInit(context) {
        // Retrieve the button element by its ID
        var customButton = document.getElementById('custpage_custom_button');

        // Attach a click event listener to the button
        if (customButton) {
            customButton.addEventListener('click', function () {
                // Call the createCustomRecord function when the button is clicked
                createCustomRecord();
            });
        }
    }
    
    return {
        pageInit: pageInit
    };
});

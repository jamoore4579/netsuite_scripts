/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */

define(['N/https', 'N/ui/dialog'], function (https, dialog) {
    function openCustomRecordForm() {
        try {
            // Specify the internal ID of the custom record form you want to open
            var customRecordFormId = 168; // Replace with your custom form ID

            // Construct the URL to open the custom record form
            var formUrl = '/app/common/custom/custrecordentry.nl?rectype=651&cf=' + customRecordFormId;

            // Redirect to the custom record form
            window.location.href = formUrl;
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
                // Call the openCustomRecordForm function when the button is clicked
                openCustomRecordForm();
            });
        }
    }
    
    return {
        pageInit: pageInit
    };
});

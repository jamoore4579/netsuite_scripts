/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record'], function (record) {
   
    // Function to be executed when a field is changed
    function fieldChanged(context) {
        // Get the current record object
        //var currentRecord = context.currentRecord;

        // Get the field ID that triggered the change
        var fieldId = context.fieldId;

        // Check if a specific button was clicked
        if (fieldId === 'custbody_deal_reg_123') {
            // Your onClick logic here
            alert('Button clicked!');
        }
    }

    // Function to be executed when the custom button is clicked
    function onClickCustomButton() {
        // Your onClick logic here
        alert('Custom Button clicked!');
    }

    return {
        fieldChanged: fieldChanged,
        // Attach the onClickCustomButton function to the custom button
        onClick: {
            custpage_custom_button: onClickCustomButton
        }
    };
});

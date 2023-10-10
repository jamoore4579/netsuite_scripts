/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/ui/serverWidget'], function (serverWidget) {

    function beforeLoad(context) {
        if (context.type === context.UserEventType.VIEW || context.type === context.UserEventType.EDIT || context.type === context.UserEventType.CREATE) {
            var form = context.form;

            // Find the 'Quote' subtab by label
            var subtabId = findSubtabByName(form, 'Quote');

            if (subtabId) {
                // Create an INLINEHTML field to hold the custom button within the 'Quote' subtab
                var customButtonField = form.addField({
                    id: 'custpage_custom_button',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: 'Custom Button',
                    container: subtabId
                });

                // Define the HTML content for the button
                var buttonHtml = '<button onclick="customButtonClick()">Click Me</button>';

                // Set the HTML content for the INLINEHTML field
                //customButtonField.defaultValue = buttonHtml;

                // Define a client script function to handle button click
                //form.clientScriptModulePath = './CustomButtonClientScript.js';
            }
        }
    }

    function findSubtabByName(form, subtabName) {
        var subtabs = form.getSublists();
        for (var i = 0; i < subtabs.length; i++) {
            if (subtabs[i].label === subtabName) {
                return subtabs[i].id;
            }
        }
        return null;
    }

    return {
        beforeLoad: beforeLoad
    };
});

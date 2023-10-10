/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/ui/serverWidget'], function (record, serverWidget) {

    function beforeLoad(context) {
        if (context.type === context.UserEventType.EDIT || context.type === context.UserEventType.VIEW || context.type === context.UserEventType.CREATE) {
            var form = context.form;

            // Create a custom button with a valid form element name
            var fillAllBtn = form.addField({
                id: 'custpage_fill_all_lines', // A valid form element name
                type: serverWidget.FieldType.INLINEHTML,
                label: 'Deal Registration',
            });

            

            // Set the default value of the button to HTML
            fillAllBtn.defaultValue = '<button type="button" style="cursor: hand; margin-bottom: 10px; margin-top: 15px; width: 250px;" id="custpage_fill_all_lines" name="custpage_fill" onclick="fillLines(true); return false;">New Deal Registration</button>';
        }
    }

    return {
        beforeLoad: beforeLoad
    };
});


//https://5779703-sb1.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=651&whence=
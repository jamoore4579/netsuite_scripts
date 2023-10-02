/**
 * User Event Script - Hide 'custevent_quote_num' Field on Before Load
 * This script hides the 'custevent_quote_num' field only on the 'task' record.
 */

/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */

define(['N/ui/serverWidget'], function (serverWidget) {

    function beforeLoad(context) {
        if (context.type == context.UserEventType.VIEW || context.UserEventType.CREATE || context.UserEventType.EDIT) {
            var quoteField = context.form.getField({id: 'custevent_quote_num'})

            quoteField.updateDisplayType({displayType: serverWidget.FieldDisplayType.HIDDEN})
        }
    }

    return {
        beforeLoad: beforeLoad
    };
});

/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(["N/ui/serverWidget"], function (serverWidget) {

    function beforeLoad(context) {
      if (
        context.type === context.UserEventType.VIEW ||
        context.type === context.UserEventType.EDIT ||
        context.type === context.UserEventType.CREATE
      ) {
      var sublist = context.form.getSublist({id: 'item'});
      sublist.getField({id: 'amount'}).updateDisplayType({displayType: serverWidget.FieldDisplayType.DISABLED});
      }
    }
  
    return {
      beforeLoad: beforeLoad
    };
  });
  
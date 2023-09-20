/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/log', 'N/ui/dialog'], function (record, log, dialog) {

    function pageInit(context) {
        var currentRecord = context.currentRecord;

        // Get the Project ID from the Job field on Sales Order
        var projectId = currentRecord.getValue({
            fieldId: 'job'
        });

        if (projectId) {
            // Load the associated Project record
            var project = record.load({
                type: record.Type.JOB,
                id: projectId
            });

            // Get the Project Status
            var projectStatus = project.getValue({
                fieldId: 'entitystatus' // Adjust fieldId as per your setup
            });

            console.log(projectStatus)

            // Check if 'entitystatus' is 126
            if (projectStatus === 126) {
                projectStatus = '1. Initiation';
            }

            // Update the Customer Project Status field on Sales Order
            currentRecord.setValue({
                fieldId: 'custbody_project_status', // Adjust fieldId as per your setup
                value: projectStatus
            });
        }
    }

    function fieldChanged(context) {
        if (context.fieldId === 'job') {
            var currentRecord = context.currentRecord;

            // Get the Project ID from the Job field on Sales Order
            var projectId = currentRecord.getValue({
                fieldId: 'job'
            });

            if (projectId) {
                // Load the associated Project record
                var project = record.load({
                    type: record.Type.JOB,
                    id: projectId
                });

                // Get the Project Status
                var projectStatus = project.getValue({
                    fieldId: 'entitystatus' // Adjust fieldId as per your setup
                });

                console.log(projectStatus)

                // Check if 'entitystatus' is 126
                if (projectStatus === 126) {
                    projectStatus = '1. Initiation';
                }

                // Update the Customer Project Status field on Sales Order
                currentRecord.setValue({
                    fieldId: 'custbody_project_status', // Adjust fieldId as per your setup
                    value: projectStatus
                });
            }
        }
    }

    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged
    };

});

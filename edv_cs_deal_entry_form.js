/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */

define([], function () {

    // Function to close the current window
    function closeWindow() {
        window.close();
    }

    // Define events on the form
    function pageInit(scriptContext) {
        // Attach the closeWindow function to the "Cancel" button
        var cancelButton = scriptContext.form.getButton({
            id: 'custpage_cancel_button' // Make sure this matches the button ID in your Suitelet
        });
        cancelButton.onClick = closeWindow;
    }

    return {
        pageInit: pageInit
    };
});

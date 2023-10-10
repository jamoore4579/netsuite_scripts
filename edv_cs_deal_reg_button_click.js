/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */

// Define the deal function globally
function deal(clicked) {
    if (clicked) {
        alert('Button clicked!');
    }
}

define([], function () {
    function pageInit(context) {
        // Retrieve the button element by its ID
        var customButton = document.getElementById('custpage_custom_button');

        // Attach a click event listener to the button
        if (customButton) {
            customButton.addEventListener('click', function () {
                // Call the deal function when the button is clicked
                deal(true);
            });
        }
    }
    
    return {
        pageInit: pageInit
    };
});

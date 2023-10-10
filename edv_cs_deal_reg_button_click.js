/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record'], function (record) {
   
    // Function to be executed when a field is changed
    function pageInit(context) {
        // Get a reference to the button element
    var button = document.getElementById("custpage_custom_button");
    
        if (button) {
            // Add an event listener to the button's click event
            button.addEventListener("click", function() {
                // Call the deal function when the button is clicked
                deal(true);
            });
        }
    }
    
    return {
        pageInit: pageInit
    };
});

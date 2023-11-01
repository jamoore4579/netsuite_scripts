/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope Public
 */

define(['N/url'], function (url) {

    function pageInit(context) {
        // This function is called when the page is loaded.
    }

    function onClickButton() {
        // Replace 'SUITELET_URL' with the actual URL of your Suitelet.
        var suiteletURL = 'https://5779703-sb1.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=654&cf=170';
        // 'https://5779703-sb1.app.netsuite.com/app/site/hosting/scriptlet.nl?script=915&deploy=1'

        // Open the Suitelet custom form in a new tab or window.
        window.open(suiteletURL, '_blank');
    }

    return {
        pageInit: pageInit,
        onClickButton: onClickButton
    };
});

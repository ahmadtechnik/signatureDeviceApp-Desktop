var $ = require("jquery");
jQuery = $;
var ipc = require("electron").ipcRenderer


$(document).ready(() => {

    var hostNameField = $(`#hostNameField`);
    var portNumberField = $(`#portNumberField`);
    var subDirField = $(`#subDirField`);
    var submitBtn = $(`#submitDataBtn`);

    // on submit btn action
    submitBtn.click((event) => {
        // get all entered data 
        if (hostNameField.val() === "" || portNumberField.val() === "" || subDirField.val() === "") {} else {
            try {
                var parsePort = parseInt(portNumberField.val());

            } catch (error) {
                console.log("port number inacceptable");
            }
        }
    })
})
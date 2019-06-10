var $ = require("jquery");
jQuery = $;
var ipc = require("electron").ipcRenderer

//
$(document).ready(() => {
    //
    var protocolField = $(`#protocolField`).dropdown()
    var hostNameField = $(`#hostNameField`);
    var portNumberField = $(`#portNumberField`);
    var subDirField = $(`#subDirField`);
    var submitBtn = $(`#submitDataBtn`);

    var closeWindowBtn = $(`#closeWindowBtn`);

    // on submit btn action
    submitBtn.click((event) => {

        console.log(protocolField.dropdown("get value"))

        // get all entered data 
        if (hostNameField.val() === "" ||
            portNumberField.val() === "" ||
            subDirField.val() === "" ||
            protocolField.dropdown("get value") === ""
        ) {} else {
            try {
                ipc.send("changeStaticFileContent", {
                    protocol: protocolField.dropdown("get value"),
                    hostname: hostNameField.val(),
                    port: portNumberField.val(),
                    subDir: subDirField.val()
                })
            } catch (error) {
                console.log("port number inacceptable");
            }
        }
    });

    // on close window btn action
    closeWindowBtn.click((event) => {
        ipc.send("closeSubWindowModal");
    })

})

/**
 * on error happened during load URL in main process
 * 
 */
ipc.on("errrField", (event, args) => {
    var mainProcessMSG = args.msg;
    $(`#errorMessageText`).text(mainProcessMSG);
    document.title = mainProcessMSG;
})

/**  ready to apply the animiation */
ipc.on("readyToShow", () => {
    $("body").transition('slide up');
})
const path = require("path");

module.exports = {
    makers: [{
        name: "@electron-forge/maker-squirrel",
        config: {
            title: "WhatsApp Electron",
            iconUrl: path.resolve(__dirname, "./icon.ico"),
        },
    }],
    packagerConfig: {
        asar: true,
    },
    publishers: [{
        name: "@electron-forge/publisher-github",
        config: {
            repository: {
                owner: "alefoll",
                name: "whatsapp-electron",
            },
        },
    }],
}

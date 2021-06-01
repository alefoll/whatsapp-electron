const path = require("path");

const name = "WhatsApp";
const icon = path.resolve(__dirname, "./icon.ico");

module.exports = {
    makers: [{
        name: "@electron-forge/maker-squirrel",
        config: {
            name,
            title     : name,
            iconUrl   : icon,
            setupIcon : icon,
        },
    }],
    packagerConfig: {
        icon,
        name,
        asar           : true,
        executableName : name
    },
    publishers: [{
        name: "@electron-forge/publisher-github",
        config: {
            repository: {
                owner : "alefoll",
                name  : "whatsapp-electron",
            },
        },
    }],
}

module.exports = {
    makers: [{
        name: '@electron-forge/maker-squirrel',
    }],
    packagerConfig: {
        asar: true,
    },
    publishers: [{
        name: '@electron-forge/publisher-github',
        config: {
            repository: {
                owner: 'alefoll',
                name: 'whatsapp-electron',
            },
        }
    }],
}

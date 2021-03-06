cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-whitelist/whitelist.js",
        "id": "cordova-plugin-whitelist.whitelist",
        "runs": true
    },
    {
        "file": "plugins/io.github.abforce.cordovaguard/www/CordovaGuard.js",
        "id": "io.github.abforce.cordovaguard.CordovaGuard",
        "clobbers": [
            "cordova.plugins.CordovaGuard"
        ]
    },
    {
        "file": "plugins/cordova-plugin-device/www/device.js",
        "id": "cordova-plugin-device.device",
        "clobbers": [
            "device"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.2.1",
    "io.github.abforce.cordovaguard": "1.0.0",
    "cordova-plugin-device": "1.1.2-dev"
}
// BOTTOM OF METADATA
});
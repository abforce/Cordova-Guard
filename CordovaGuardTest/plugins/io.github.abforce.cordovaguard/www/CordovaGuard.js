/**
* Cordova Guard
*	A JavaScript based access control solution for protecting
*	Cordova JavaScript APIs against malicious JavaScript codes
*
* Author		Ali Reza Barkhordari
*				abarkhordari@ce.sharif.edu
*				
* Start Date	Saturday 26 September 2015 
* 
* Copyright Ali Reza Barkhordari 2016
*/

var policies,
    registry = [],
    argscheck = require('cordova/argscheck'),
    utils = require('cordova/utils'),
    urlutil = require('cordova/urlutil'),
    channel = require('cordova/channel'),
    exec = require('cordova/exec'),
    plugins = require('cordova/plugin_list'),
    modules = [];

// ===================================================
//         CordovaClient Constructor Function
// ===================================================

function Client(script, parent, requestedPermissions){
    // List of permissions granted for this client
    var permissions;

    if(parent !== undefined){
        var parentPermissions;

        argscheck.checkArgs('OOA', 'window.CordovaClient', arguments);
        if(!(parent instanceof Client)){
            throw new Error('The first argument passed in must be of type CordovaClient.');
        }

        parentPermissions = parent.getPermissions();
        permissions = getCommonPermissions(requestedPermissions, parentPermissions);

    } else {

        permissions = getPermissionsOfScriptElement(script);
    }
    populateClient(this, permissions);
    registerClient(this, permissions);
}

// ===================================================
//             CordovaClient Prototype
// ===================================================

Client.prototype.getPermissions = function(){
    return getClientPermissions(this);
};

// ===================================================
//                  Helper Functions
// ===================================================

function getCommonPermissions(permSet1, permSet2){
    return permSet1.filter(function(perm){
        return permSet2.indexOf(perm) != -1;
    });
}

function getPermissionsOfScriptElement(script){
    var url = script.src,
        permissions = [],
        i;

    for(i = 0; i < policies.length; i += 1){
        var entry = policies[i];

        if(matchRule(url, entry.source) && entry.access){
            permissions.push(entry.pluginName);
        }
    }
    
    return permissions;
}

function populateClient(client, permissions){
    var i, j;

    for(i = 0; i < permissions.length; i += 1){
        var perm = permissions[i];

        for(j = 0; j < modules.length; j += 1){
            var module = modules[j];

            if(module.id == perm){
                attachClobbers(client, module.module, module.clobbers);
            }
        }
    }
}

function attachClobbers(client, module, clobbers){
    var i;

    function attachClobber(symbolPath, context, module) {
        var parts = symbolPath.split('.');
        var cur = context;
        for (var i = 0, part; part = parts[i]; ++i) {
            if(i == parts.length - 1){
                cur[part] = module;
            } else {
                cur = cur[part] = cur[part] || {};
            }
        }
    }

    for(i = 0; i < clobbers.length; i += 1){
        var clobber = clobbers[i];
        attachClobber(clobber, client, module);
    }
}

function getClientPermissions(client){
    var i, length;

    if(!(client instanceof Client)){
        throw new Error('Input argument must be of type CordovaClient');
    }

    for(i = 0, length = registry.length; i < length; i += 1){
        var entry = registry[i];

        if(entry.client === client){
            return entry.permissions.slice();
        }
    }
}

function registerClient(client, permissions){
    registry.push({
        client: client,
        permissions: permissions
    });
}

function extractModule(root, clobbers){
    var i, module;

    for(i = 0; i < clobbers.length; i += 1){
        var info = parseObjectPath(root, clobbers[i]);
        if(i == 0){
            module = info.obj;
        }
        if(!delete info.lastParent[info.lastPart]){
            throw new Error('Clobber not found');
        }
    }

    return module;
}

function parseObjectPath(root, path){
    var parts = path.split('.'),
        cur = root,
        i, part, lastParent;

    for (i = 0; part = parts[i]; i += 1) {
        if(i == parts.length - 1){
            lastParent = cur;
        }
        cur = cur[part];
    }

    return {
        obj: cur,
        lastPart: parts[i - 1],
        lastParent: lastParent
    };
}

function matchRule(str, rule) {
    return new RegExp('^' + rule.replace('*', '.*').replace('.', '\.') + '$').test(str);
}

// ===================================================
//                       Init
// ===================================================

channel.onCordovaReady.subscribe(function() {
    var i;

    exec(function(p){
        policies = p;
    }, function(e){
        utils.alert("[ERROR] Error initializing Cordova: " + e);
    }, "CordovaGuard", "getPermissions", []);

    for(i = 0; i < plugins.length; i += 1){
        var plugin = plugins[i];

        if(plugin.clobbers && plugin.clobbers.length > 0){
            modules.push({
                id : plugin.id,
                clobbers : plugin.clobbers,
                module: extractModule(window, plugin.clobbers)
            });
        }
    }

    delete window.cordova;
});

// ===================================================
//                      Exports
// ===================================================

window._CordovaClient = Client;

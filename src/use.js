import Module from './Module'

import _getModuleExports from './utils'

export default function use(ids, callback) {
    if (!Array.isArray(ids)) {
        ids = [ids]
    }
    
    Promise.all(ids.map(function (id) {
        return _moduleLoader(s_cmd.config.root + id);
    })).then(function (list) {
        if (typeof callback === 'function') {
            callback.apply(window, list);
        }
    }, function (errorInfo) {
        throw errorInfo;
    });
}

function _moduleLoader(id, callback) {
    return new Promise(function (resolve, reject) {
        var mod =  s_cmd.modules[id] || new Module(id);
        mod.on('complete', function () {
            var exp = _getModuleExports(mod);
            if (typeof callback === 'function') {
                callback(exp);
            }
            resolve(exp);
        });
        mod.on('error', reject);
    });
}

import _getModuleExports from './utils'

export default function require(id) {
    id = s_cmd.config.root + id;
    var mod = s_cmd.modules[id];
    if (mod) {
        return _getModuleExports(mod);
    }
    else {
        throw 'can not get module by from:' + id;
    }
}


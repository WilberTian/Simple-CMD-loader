export function getModuleExports(mod) {
    if (!mod.exports) {
        mod.exports = {};
        mod.factory(s_cmd.require, mod.exports, mod);
    }
    return mod.exports;
}
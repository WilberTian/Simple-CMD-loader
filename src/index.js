import _use from './use'
import _require from './require'
import _define from './define'

const s_cmd = {
    use: _use,
    require: _require,
    
    modules: {},
    
    config: {
        root: '/'
    },
    
    setConfig: function (obj) {
        for (var key in obj) {
            this.config[key] = obj[key];
        }
    },
    
    MODULE_STATUS: {
        PENDDING: 0,
        LOADING: 1,
        COMPLETED: 2,
        ERROR: 3
    }
}

window.s_cmd = s_cmd
window.define = _define
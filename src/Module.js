export default class Module {
    constructor(id) {
		s_cmd.modules[id] = this; 
        this.id = id;
        this.status = s_cmd.MODULE_STATUS.PENDDING; 
        this.factory = null;    
        this.dependences = null;    
        this.callbacks = {};   
        this.load();
	}

    load() {
        var id = this.id;
        var script = document.createElement('script');
        script.src = id;
        script.onerror = function (event) {
            this.setStatus(s_cmd.MODULE_STATUS.ERROR, {
                id: id,
                error: (this.error = new Error('module can not load.'))
            });
        }.bind(this);
        document.head.appendChild(script);
        this.setStatus(s_cmd.MODULE_STATUS.LOADING);
    }

    on(event, callback) {
        (this.callbacks[event] || (this.callbacks[event] = [])).push(callback);
        if (
            (this.status === s_cmd.MODULE_STATUS.LOADING && event === 'load') ||
            (this.status === s_cmd.MODULE_STATUS.COMPLETED && event === 'complete')
        ) {
            callback(this);
        }
        if (this.status === s_cmd.MODULE_STATUS.ERROR && event === 'error') {
            callback(this, this.error);
        }
    }

    fire(event, arg) {
        (this.callbacks[event] || []).forEach(function (callback) {
            callback(arg || this);
        }.bind(this));
    }

    setStatus(status, info) {
        if (this.status !== status) {
            this.status = status;
            switch (status) {
                case s_cmd.MODULE_STATUS.LOADING:
                    this.fire('load');
                    break;
                case s_cmd.MODULE_STATUS.COMPLETED:
                    this.fire('complete');
                    break;
                case s_cmd.MODULE_STATUS.ERROR:
                    this.fire('error', info);
                    break;
                default:
                    break;
            }
        }
    }
}
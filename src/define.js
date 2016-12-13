import Module from './Module'

export default function define(factory) {
    var id = _getCurrentScript().replace(location.origin, '');
    var mod = s_cmd.modules[id];
    var dependences = mod.dependences = _getDenpendence(factory.toString());
    mod.factory = factory;
    if (dependences) {
        Promise.all(dependences.map(function (id) {
            return new Promise(function (resolve, reject) {
                id = s_cmd.config.root + id;
                var depMode = s_cmd.modules[id] || new Module(id);
                depMode.on('complete', resolve);
                depMode.on('error', reject);
            });
        })).then(function () {
            mod.setStatus(s_cmd.MODULE_STATUS.COMPLETED);
        }, function (error) {
            mod.setStatus(s_cmd.MODULE_STATUS.ERROR, error);
        });
    }
    else {
        mod.setStatus(s_cmd.MODULE_STATUS.COMPLETED);
    }
}

function _getCurrentScript() {
    var doc = document;
    if(doc.currentScript) {
        return doc.currentScript.src;
    }
    var stack;
    try {
        a.b.c();
    } catch(e) {
        stack = e.stack;
        if(!stack && window.opera){
            stack = (String(e).match(/of linked script \S+/g) || []).join(" ");
        }
    }
    if(stack) {
        stack = stack.split( /[@ ]/g).pop();
        stack = stack[0] == "(" ? stack.slice(1,-1) : stack;
        return stack.replace(/(:\d+)?:\d+$/i, "");
    }
    var nodes = head.getElementsByTagName("script");
    for(var i = 0, node; node = nodes[i++];) {
        if(node.readyState === "interactive") {
            return node.className = node.src;
        }
    }
}

function _getDenpendence(factory) {
    var list = factory.match(/require\(.+?\)/g);
    if (list) {
        list = list.map(function (dep) {
            return dep.replace(/(^require\(['"])|(['"]\)$)/g, '');
        });
    }
    return list;
}
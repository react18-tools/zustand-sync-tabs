"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncTabs = void 0;
var syncTabs = function (f, options) { return function (set, get, store) {
    /** avoid errors on server side or when BroadcastChannel is not supported */
    if (!globalThis.BroadcastChannel) {
        console.log("BroadcastChannel is not supported in this context!");
        return f(set, get, store);
    }
    var channel = new BroadcastChannel(options.name);
    var set_ = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var prevState = get();
        set.apply(void 0, args);
        var currentState = get();
        var stateUpdates = {};
        /** sync only updated state to avoid un-necessary re-renders */
        Object.keys(currentState).forEach(function (k) {
            var _a;
            if (!((_a = options.regExpToIgnore) === null || _a === void 0 ? void 0 : _a.test(k)) && currentState[k] !== prevState[k]) {
                stateUpdates[k] = currentState[k];
            }
        });
        if (Object.keys(stateUpdates).length) {
            channel === null || channel === void 0 ? void 0 : channel.postMessage(stateUpdates);
        }
    };
    if (channel) {
        channel.onmessage = function (e) {
            set(e.data);
        };
    }
    return f(set_, get, store);
}; };
exports.syncTabs = syncTabs;

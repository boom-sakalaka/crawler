"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("../router");
require("reflect-metadata");
function controller(root) {
    return function (target) {
        for (var key in target.prototype) {
            var path = Reflect.getMetadata("path", target.prototype, key);
            var method = Reflect.getMetadata("method", target.prototype, key);
            var middleware = Reflect.getMetadata("middleware", target.prototype, key);
            var handler = target.prototype[key];
            if (path && method) {
                var fullPath = root === "/" ? path : "" + root + path;
                if (middleware) {
                    router_1.router[method](fullPath, middleware, handler);
                }
                else {
                    router_1.router[method](fullPath, handler);
                }
            }
        }
    };
}
exports.controller = controller;

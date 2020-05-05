"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
function use(middleware) {
    return function (target, key) {
        var originMiddlewares = Reflect.getMetadata("middlewaress", target, key) || [];
        originMiddlewares.push(originMiddlewares);
        Reflect.defineMetadata("middlewaress", originMiddlewares, target, key);
    };
}
exports.use = use;

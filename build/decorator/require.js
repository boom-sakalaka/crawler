"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Mehtods;
(function (Mehtods) {
    Mehtods["get"] = "get";
    Mehtods["post"] = "post";
})(Mehtods = exports.Mehtods || (exports.Mehtods = {}));
function getRequestDecorator(type) {
    return function (path) {
        return function (target, key) {
            Reflect.defineMetadata("path", path, target, key);
            Reflect.defineMetadata("method", type, target, key);
        };
    };
}
exports.get = getRequestDecorator(Mehtods.get);
exports.post = getRequestDecorator(Mehtods.post);

import { router } from "../router";
import "reflect-metadata";
import { RequestHandler } from "express";
import { Mehtods } from "./require";

export function controller(root: string) {
  return function (target: new (...args: any[]) => any) {
    for (let key in target.prototype) {
      const path: string = Reflect.getMetadata("path", target.prototype, key);
      const method: Mehtods = Reflect.getMetadata(
        "method",
        target.prototype,
        key
      );
      const middleware: RequestHandler = Reflect.getMetadata(
        "middleware",
        target.prototype,
        key
      );
      const handler = target.prototype[key];
      if (path && method) {
        const fullPath = root === "/" ? path : `${root}${path}`;
        if (middleware) {
          router[method](fullPath, middleware, handler);
        } else {
          router[method](fullPath, handler);
        }
      }
    }
  };
}

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
      const middlewares: RequestHandler[] = Reflect.getMetadata(
        "middlewares",
        target.prototype,
        key
      );
      const handler = target.prototype[key];
      if (path && method) {
        const fullPath = root === "/" ? path : `${root}${path}`;
        if (middlewares) {
          router[method](fullPath, ...middlewares, handler);
        } else {
          router[method](fullPath, handler);
        }
      }
    }
  };
}

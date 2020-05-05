import { RequestHandler } from "express";
import { CrowllerController, LoginController } from "../controller";
import "reflect-metadata";
export function use(middleware: RequestHandler) {
  return function (target: CrowllerController | LoginController, key: string) {
    const originMiddlewares =
      Reflect.getMetadata("middlewaress", target, key) || [];
    originMiddlewares.push(originMiddlewares);
    Reflect.defineMetadata("middlewaress", originMiddlewares, target, key);
  };
}

import { CrowllerController, LoginController } from "../controller";
export enum Mehtods {
  get = "get",
  post = "post",
}

function getRequestDecorator(type: Mehtods) {
  return function (path: string) {
    return function (
      target: CrowllerController | LoginController,
      key: string
    ) {
      Reflect.defineMetadata("path", path, target, key);
      Reflect.defineMetadata("method", type, target, key);
    };
  };
}

export const get = getRequestDecorator(Mehtods.get);
export const post = getRequestDecorator(Mehtods.post);

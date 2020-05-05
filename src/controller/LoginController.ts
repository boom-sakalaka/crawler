import { Request, Response } from "express";
import { controller, get, post } from "../decorator";
import { getResponseData } from "../utils/util";
import "reflect-metadata";
interface RequestWithBody extends Request {
  body: {
    [key: string]: string | undefined;
  };
}

@controller("/api")
export class LoginController {
  static isLogin(req: RequestWithBody): boolean {
    return !!(req.session ? req.session.login : undefined);
  }

  @get("/isLogin")
  isLogin(req: RequestWithBody, res: Response) {
    const isLogin = LoginController.isLogin(req);
    if (isLogin) {
      res.json(getResponseData(true));
    } else {
      res.json(getResponseData(false, "未登录"));
    }
  }

  @post("/login")
  login(req: RequestWithBody, res: Response): void {
    const { password } = req.body;
    const isLogin = LoginController.isLogin(req);
    if (isLogin) {
      res.json(getResponseData(true));
    } else {
      if (password === "123" && req.session) {
        req.session.login = true;
        res.json(getResponseData(true));
      } else {
        res.json(getResponseData(false, "登录失败"));
      }
    }
  }

  @get("/logout")
  logout(req: RequestWithBody, res: Response): void {
    if (req.session) {
      req.session.login = undefined;
    }
    res.json(getResponseData(true));
  }
}

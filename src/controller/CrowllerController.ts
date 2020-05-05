import fs from "fs";
import path from "path";
import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
import { controller, use, get } from "../decorator";
import { getResponseData } from "../utils/util";
import Crowller from "../utils/crowller";
import Analyer from "../utils/Analyzer";

interface RequestWithBody extends Request {
  body: {
    [key: string]: string | undefined;
  };
}
//业务函数的中间件
const checkLogin = (
  req: RequestWithBody,
  res: Response,
  next: NextFunction
): void => {
  const isLogin = !!(req.session ? req.session.login : undefined);
  if (isLogin) {
    next();
  } else {
    res.send(getResponseData(null, "请先登录!"));
  }
};
@controller("/api")
export class CrowllerController {
  @get("/getData")
  @use(checkLogin)
  getData(req: RequestWithBody, res: Response): void {
    const secret = "x3b174jsx";
    const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
    const analyzer = Analyer.getInstance();
    const crowller = new Crowller(url, analyzer);
    res.json(getResponseData(true));
  }
  @get("/showData")
  @use(checkLogin)
  showData(req: RequestWithBody, res: Response): void {
    try {
      const position = path.resolve(__dirname, "../../data/course.json");
      const result = fs.readFileSync(position, "utf-8");
      res.json(getResponseData(JSON.parse(result)));
    } catch (err) {
      res.json(getResponseData(false, "数据不存在"));
    }
  }
}

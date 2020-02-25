import fs from "fs";
import path from "path";
import { Router, Request, Response, NextFunction } from "express";
import Crowller from "./utils/crowller";
import Analyer from "./utils/Analyzer";
import { getResponseData } from "./utils/util";
const router = Router();

//问题一:express 库的类型定义文件 .d.ts 文件类型描述不准确
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
) => {
  const isLogin = req.session ? req.session.login : undefined;
  if (isLogin) {
    next();
  } else {
    res.send(getResponseData(null, "请先登录!"));
  }
};

router.get("/", (req: Request, res: Response) => {
  const isLogin = req.session ? req.session.login : undefined;
  if (isLogin) {
    res.send(` <html>
    <body>
     <a href="/getData">爬取内容</a>
     <a href="/showData">展示内容</a>
     <a href="/logout">退出</a>
    </body>
  </html>`);
  } else {
    res.send(
      `
      <html>
        <body>
          <form method="post" action="/login">
            <input type="password" name="password">
            <button>登录</button>
          </form>
        </body>
      </html>
      `
    );
  }
});

router.get("/logout", (req: Request, res: Response) => {
  if (req.session) {
    req.session.login = undefined;
  }
  res.json(getResponseData(true));
});
router.post("/login", (req: RequestWithBody, res: Response) => {
  const { password } = req.body;
  const isLogin = req.session ? req.session.login : undefined;
  if (isLogin) {
    res.json(getResponseData(false, "已经登录过了"));
  } else {
    if (password === "123" && req.session) {
      req.session.login = true;
      res.json(getResponseData(true));
    } else {
      res.json(getResponseData(false, "登录失败"));
    }
  }
});
router.get("/getData", checkLogin, (req: RequestWithBody, res: Response) => {
  const secret = "secretKey";
  const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
  const analyzer = Analyer.getInstance();
  const crowller = new Crowller(url, analyzer);
  res.json(getResponseData(true));
});

router.get("/showData", checkLogin, (req: RequestWithBody, res: Response) => {
  try {
    const position = path.resolve(__dirname, "../data/course.json");
    const result = fs.readFileSync(position, "utf-8");
    res.json(getResponseData(JSON.parse(result)));
  } catch (err) {
    res.json(getResponseData(false, "数据不存在"));
  }
});
export default router;

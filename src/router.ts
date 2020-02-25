import { Router, Request, Response, NextFunction } from "express";
import Crowller from "./utils/crowller";
import Analyer from "./utils/Analyzer";
import fs from "fs";
import path from "path";
import { json } from "body-parser";
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
    res.send("请先登录!");
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
  res.redirect("/");
});
router.post("/login", (req: RequestWithBody, res: Response) => {
  const { password } = req.body;
  const isLogin = req.session ? req.session.login : undefined;
  if (isLogin) {
    res.send("已经登录过");
  } else {
    if (password === "123" && req.session) {
      req.session.login = true;
      res.send("登录成功!");
    } else {
      res.send("登录失败!");
    }
  }
});
router.get("/getData", checkLogin, (req: RequestWithBody, res: Response) => {
  const secret = "secretKey";
  const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
  const analyzer = new Analyer();
  const crowller = new Crowller(url, analyzer);
  res.send("getData success");
});

router.get("/showData", checkLogin, (req: RequestWithBody, res: Response) => {
  try {
    const position = path.resolve(__dirname, "../data/course.json");
    const result = fs.readFileSync(position, "utf-8");
    res.json(JSON.parse(result));
  } catch (err) {
    res.json("尚未爬取到内容");
  }
});
export default router;

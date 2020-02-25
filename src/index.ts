import express, { Request, Response, NextFunction } from "express";
import bodyParset from "body-parser";
import cookieSession from "cookie-session";
import router from "./router";

const app = express();
app.use(bodyParset.urlencoded({ extended: false }));
app.use(
  cookieSession({
    name: "session",
    keys: ["mykey"],
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  })
);
app.use((req: Request, res: Response, next: NextFunction) => {
  req.sayHello = "hi";
  next();
});
app.use(router);
app.listen(7001, () => {
  console.log("server is running");
});

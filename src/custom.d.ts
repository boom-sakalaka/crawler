//类型融合
//问题二:当我们使用中间件的时候，对Req 或者 Res 做了修改之后，实际上类型并不能改变 新增加的属性会报错
declare namespace Express {
  interface Request {
    sayHello: string;
  }
}

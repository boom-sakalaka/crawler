"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var express_1 = require("express");
var crowller_1 = __importDefault(require("./utils/crowller"));
var Analyzer_1 = __importDefault(require("./utils/Analyzer"));
var util_1 = require("./utils/util");
var router = express_1.Router();
//业务函数的中间件
var checkLogin = function (req, res, next) {
    var isLogin = req.session ? req.session.login : undefined;
    if (isLogin) {
        next();
    }
    else {
        res.send(util_1.getResponseData(null, "请先登录!"));
    }
};
router.get("/", function (req, res) {
    var isLogin = req.session ? req.session.login : undefined;
    if (isLogin) {
        res.send(" <html>\n    <body>\n     <a href=\"/getData\">\u722C\u53D6\u5185\u5BB9</a>\n     <a href=\"/showData\">\u5C55\u793A\u5185\u5BB9</a>\n     <a href=\"/logout\">\u9000\u51FA</a>\n    </body>\n  </html>");
    }
    else {
        res.send("\n      <html>\n        <body>\n          <form method=\"post\" action=\"/login\">\n            <input type=\"password\" name=\"password\">\n            <button>\u767B\u5F55</button>\n          </form>\n        </body>\n      </html>\n      ");
    }
});
router.get("/logout", function (req, res) {
    if (req.session) {
        req.session.login = undefined;
    }
    res.json(util_1.getResponseData(true));
});
router.post("/login", function (req, res) {
    var password = req.body.password;
    var isLogin = req.session ? req.session.login : undefined;
    if (isLogin) {
        res.json(util_1.getResponseData(false, "已经登录过了"));
    }
    else {
        if (password === "123" && req.session) {
            req.session.login = true;
            res.json(util_1.getResponseData(true));
        }
        else {
            res.json(util_1.getResponseData(false, "登录失败"));
        }
    }
});
router.get("/getData", checkLogin, function (req, res) {
    var secret = "secretKey";
    var url = "http://www.dell-lee.com/typescript/demo.html?secret=" + secret;
    var analyzer = Analyzer_1.default.getInstance();
    var crowller = new crowller_1.default(url, analyzer);
    res.json(util_1.getResponseData(true));
});
router.get("/showData", checkLogin, function (req, res) {
    try {
        var position = path_1.default.resolve(__dirname, "../data/course.json");
        var result = fs_1.default.readFileSync(position, "utf-8");
        res.json(util_1.getResponseData(JSON.parse(result)));
    }
    catch (err) {
        res.json(util_1.getResponseData(false, "数据不存在"));
    }
});
exports.default = router;

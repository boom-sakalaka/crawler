//Ts 直接引用js会报错 .d.js 翻译文件
import fs from "fs";
import path from "path";
import superagent from "superagent";
import DellAnalyer from "./dellAnalyzer";

export interface Analyzer {
  analyzer: (html: string, filePath: string) => string;
}

class Crowller {
  private filePath = path.resolve(__dirname, "../data/course.json");

  async getRawHtml() {
    const result = await superagent.get(this.url);
    return result.text;
  }

  writeFile(content: string) {
    fs.writeFileSync(this.filePath, content);
  }
  async initSpiderProcess() {
    const html = await this.getRawHtml();
    const fileContent = this.analyzer.analyzer(html, this.filePath);
    this.writeFile(fileContent);
  }
  constructor(private url: string, private analyzer: Analyzer) {
    this.initSpiderProcess();
  }
}
const secret = "secretKey";
const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
const analyzer = DellAnalyer.getInstance();
const crowller = new Crowller(url, analyzer);

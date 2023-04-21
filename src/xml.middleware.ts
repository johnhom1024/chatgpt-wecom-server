import { Injectable, NestMiddleware } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import * as parserXml from 'body-parser-xml';

// 给 bodyParser对象加上一个xml方法
parserXml(bodyParser);

// 支持解析text/xml类型，因为企业微信就是返回这种类型
const bodyParserMiddleware = bodyParser.xml({
  xmlParseOptions: {
    explicitArray: false, // 始终返回数组。默认情况下只有数组元素数量大于 1 是才返回数组。
  },
});

@Injectable()
export class XMLMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    bodyParserMiddleware(req, res, next);
  }
}

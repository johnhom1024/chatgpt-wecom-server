import { Logger, Injectable, HttpException } from '@nestjs/common';
import axios from 'axios';
import { decrypt, getSignature } from '@wecom/crypto';
import { parseStringPromise } from 'xml2js';
import { WecomErrorCode } from '../types/index.js'
@Injectable()
export class WecomService {
  private readonly logger = new Logger(WecomService.name);
  access_token: string;
  async onMouduleInit() {
    await this.getWecomAccessToken();
  }

  // 获取企业微信的token
  async getWecomAccessToken() {
    if (this.access_token) {
      return this.access_token;
    }
    // 获取的 access_token
    const {
      data,
      errcode = 0,
      errmsg = '',
    } = (await axios.get(
      `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${process.env.CORP_ID}&corpsecret=${process.env.APP_SECRET_KEY}`,
    )) as { data: any; errcode: number; errmsg: string };

    if (errcode !== 0) {
      throw new HttpException(errmsg, 500);
    }

    const { access_token } = data;
    this.logger.log('获取企业微信 token 成功');
    this.access_token = access_token;
    return access_token;
  }

  // 测试接收用户发送的的信息
  testGetMessage(query: { msg_signature; timestamp; nonce; echostr }) {
    let message = '';
    const { msg_signature, timestamp, nonce, echostr } = query;

    const signature = getSignature(
      process.env.WECOM_GET_MESSAGE_TOKEN,
      timestamp,
      nonce,
      echostr,
    );

    if (signature === msg_signature) {
      message = decrypt(process.env.WECOM_ENCODING_AES_KEY, echostr).message;
      this.logger.log('测试接收成功');
    } else {
      throw new HttpException('消息解密失败', 401);
    }

    return message;
  }

  async getMessage(
    query: { msg_signature; timestamp; nonce },
    xml: { Encrypt: string },
  ) {
    const { Encrypt } = xml;
    const { message = '' } = decrypt(
      process.env.WECOM_ENCODING_AES_KEY,
      Encrypt,
    );

    const { xml: messageData } = await parseStringPromise(message, {
      explicitArray: false,
    });
    const { FromUserName = '', Content = '' } = messageData;
    this.logger.log(`FromUserName: ${FromUserName}`);
    this.logger.log(`Content: ${Content}`);

    return {
      message: Content,
      touser: FromUserName,
    };
  }
 /**
  * 
  * @param user 发送给的用户
  * @param content 
  * @returns 
  */
  async sendMsgByWecom(user, content) {
    const { data = {} } = await axios.post(
      `https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${this.access_token}`,
      {
        touser: user,
        msgtype: 'text',
        agentid: process.env.WECOM_AGENT_ID,
        text: { content },
      },
      {
        proxy: false,
        httpAgent: false,
        httpsAgent: false,
      }
    );
    return data
  }

  /**
   * @description:
   * @param {string} touser 来自发送信息的用户id
   * @param {*} content
   * @return {*}
   */
  async sendMessage({ touser, content }: { touser: string; content: string }) {
    // 获取access_token
    await this.getWecomAccessToken();
    this.logger.log(`发送给用户id：${touser}`);
    this.logger.log(`发送内容：${content}`);
    // todo
    
    const data = await this.sendMsgByWecom(touser, content);
    const { errcode, errmsg } = data;

    // token 过期
    if ([WecomErrorCode.token_expired].includes(errcode)) {
      this.logger.error('token已过期，重新发送');
      this.logger.error(data);
      this.access_token = '';
      // 间隔1s钟再请求
      setTimeout(() => {
        this.sendMessage({ touser, content });
      }, 1000);
    } else if (errmsg !== 'ok') {
      this.logger.error(`企业微信发送错误，错误码: ${errcode}`);
      //this.logger.error(errmsg);
this.logger.error(JSON.stringify(data));
      setTimeout(() => {
        this.sendMsgByWecom( touser, content );
      }, 1000);
    }
  }
}

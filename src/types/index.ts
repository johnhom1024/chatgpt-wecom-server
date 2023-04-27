import type fetch from 'node-fetch';
export interface SetProxyOptions {
  fetch?: typeof fetch;
}

// https://developer.work.weixin.qq.com/document/path/90313
export enum WecomErrorCode {
  // token已过期
  token_expired = 42001,
  // token不合法
  token_invaild = 40014
}
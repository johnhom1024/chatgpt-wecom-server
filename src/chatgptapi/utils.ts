import fetch from 'node-fetch';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { SetProxyOptions } from '../types/index.js';
import httpsProxyAgent from 'https-proxy-agent';

const { HttpsProxyAgent } = httpsProxyAgent;

function isNotEmptyString(value: any): boolean {
  return typeof value === 'string' && value.length > 0;
}

export function setupProxy(options: SetProxyOptions) {
  if (
    isNotEmptyString(process.env.SOCKS_PROXY_HOST) &&
    isNotEmptyString(process.env.SOCKS_PROXY_PORT)
  ) {
    const agent = new SocksProxyAgent({
      hostname: process.env.SOCKS_PROXY_HOST,
      port: process.env.SOCKS_PROXY_PORT,
      userId: isNotEmptyString(process.env.SOCKS_PROXY_USERNAME)
        ? process.env.SOCKS_PROXY_USERNAME
        : undefined,
      password: isNotEmptyString(process.env.SOCKS_PROXY_PASSWORD)
        ? process.env.SOCKS_PROXY_PASSWORD
        : undefined,
    });
    options.fetch = (url, options) => {
      return fetch(url, { agent, ...options });
    };
  } else if (
    isNotEmptyString(process.env.HTTPS_PROXY) ||
    isNotEmptyString(process.env.ALL_PROXY)
  ) {
    const httpsProxy = process.env.HTTPS_PROXY || process.env.ALL_PROXY;
    console.log(`-------------------- 当前代理地址：  ${httpsProxy}     --------------------- `)
    if (httpsProxy) {
      const agent = new HttpsProxyAgent(httpsProxy);
      options.fetch = (url, options) => {
        return fetch(url, { agent, ...options });
      };
    }
  } else {
    options.fetch = (url, options) => {
      return fetch(url, { ...options });
    };
  }
}

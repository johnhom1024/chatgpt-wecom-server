import type fetch from 'node-fetch';
export interface SetProxyOptions {
  fetch?: typeof fetch;
}

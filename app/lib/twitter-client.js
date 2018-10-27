import 'whatwg-fetch';
import CryptoJS from 'crypto-js';
import { key, secret } from './api-credentials';
import { appPasswordKey } from './constants';

const APIRoot = 'https://api.twitter.com';
const APIVersion = '1.1';

export default class TwitterClient {
  get credentials(){
    if(this.creds) return this.creds;
    const encryptionKey = window.localStorage.getItem(appPasswordKey);
    if(!encryptionKey){
      throw new Error('Encryption key not found');
    }
    const creds = {
      APIKey: CryptoJS.AES.decrypt(key, encryptionKey).toString(CryptoJS.enc.Utf8),
      APISecret: CryptoJS.AES.decrypt(secret, encryptionKey).toString(CryptoJS.enc.Utf8)
    }
    if(!creds.APIKey || !creds.APISecret){
      throw new Error('Could not decrypt API credentials');
    }
    this.creds = creds;
    return this.creds;
  }
  getAccessToken(){
    const { APIKey, APISecret } = this.credentials;
    return fetch(
      `${APIRoot}/${APIVersion}/oauth2/token`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic btoa('username:password')`
        }
      }
    );
  }
}

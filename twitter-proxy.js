const request = require('request-promise-native');
const CryptoJS = require('crypto-js');
const { key, secret } = require('./api-credentials');
const { sendJSON } = require('./utils');

const twitterPrefixRegex = /^\/twitter/;
const twitterAPIRoot = 'https://api.twitter.com/1.1'

var credentials = null;
const getCredentials = function(encryptionKey, forceValidate){
  if(credentials && !forceValidate) return credentials;
  if(!encryptionKey){
    throw new Error('Encryption key not found');
  }
  encryptionKey = encryptionKey.toLowerCase();
  const creds = {
    APIKey: CryptoJS.AES.decrypt(key, encryptionKey).toString(CryptoJS.enc.Utf8),
    APISecret: CryptoJS.AES.decrypt(secret, encryptionKey).toString(CryptoJS.enc.Utf8)
  };
  if(!creds.APIKey || !creds.APISecret){
    throw new Error('Could not decrypt API credentials');
  }
  credentials = creds;
  return credentials;
}

var accessToken = null;
const getAccessToken = async function(){
  if(accessToken) return accessToken;
  const { APIKey, APISecret } = getCredentials();
  const { access_token } = await request(
    {
      method: 'POST',
      uri: 'https://api.twitter.com/oauth2/token',
      auth: {
        username: APIKey,
        password: APISecret
      },
      form: {
        grant_type: 'client_credentials'
      },
      json: true
    }
  );
  accessToken = access_token;
  return accessToken;
}

const makeAPICall = async function(req, res){
  const token = await getAccessToken();
  const twitterResponse = await request(
    {
      method: req.method,
      uri: `${twitterAPIRoot}${req.url.replace(twitterPrefixRegex, '')}`,
      json: true,
      auth: {
        bearer: token
      },
      resolveWithFullResponse: true
    }
  );
  return sendJSON(twitterResponse.body, res);
}

module.exports = async function(req, res, next){
  try {
    // not prefixed with /twitter, just passthrough
    if(!twitterPrefixRegex.test(req.url)){
      return next();
    }
    // validate password header
    getCredentials(req.headers['app-password'], true);
    if(req.url === '/twitter/verify-password'){
      return sendJSON(
        { success: true },
        res
      );
    }
    return await makeAPICall(req, res);
  }
  catch(err){
    console.error(err);
    res.statusCode = err.statusCode || 500;
    sendJSON(
      {err: err.error || err.message || err},
      res
    );
  }
}

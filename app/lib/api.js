import 'whatwg-fetch';
import { appPasswordKey } from './constants';

const addURLParams = (url, params) => {
  var qs = '';
  if(params){
    let s = new URLSearchParams();
    Object.keys(params).forEach(
      k => s.append(k, params[k])
    )
    qs = `?${s.toString()}`;
  }
  return `${url}${qs}`;
}

const makeAPICall = async function(url, options={}){
  const response = await fetch(
    url,
    {
      headers: {
        'app-password': window.localStorage.getItem(appPasswordKey)
      },
      ...options
    }
  );
  if(response.status >= 200 && response.status < 400){
    return await response.json();
  }
  throw await response;
}

export const verifyPassword = password => makeAPICall(
  '/twitter/verify-password',
  {
    headers: {
      'app-password': password
    }
  }
);

export const searchTweets = query => makeAPICall(
  addURLParams(
    '/twitter/search/tweets.json',
    {
      q: `${query} -filter:retweets`,
      count: 100,
      tweet_mode: 'extended',
      include_entities: true
    }
  )
);

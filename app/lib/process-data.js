import { english } from 'stopwords';

const stopWords = english.concat([
  'cc',
  'via'
]);

const groupTopWordsFromTweets = tweets => tweets
  // grab meaningful_words
  .map(
    tweet => tweet.meaningful_words
  )
  // flatten
  .reduce(
    (acc, v) => acc.concat(v),
    []
  )
  // reduce
  .reduce(
    (acc, v) => {
      v = v.toLowerCase();
      if(v.length < 2 || stopWords.find(w => w === v)){
        return acc;
      }
      const matchingWord = acc.find(w => w[0] === v)
      if(matchingWord){
        matchingWord[1] += 1;
      }
      else {
        acc.push([v, 1]);
      }
      return acc;
    },
    []
  )
  // sort by greatest number
  .sort(
    (a, b) => b[1] - a[1]
  )
  .slice(0, 21);

export default function(tweets)  {
  tweets = tweets.map(
    tw => {
      return {
        ...tw,
        meaningful_words: tw.full_text.toLowerCase()
          .replace(/[^A-z0-9@#]|(http\S+)|(&*\S*;)|(@\S+)|(\b\d+\b)/ig, ' ')
          .split(' ')
          .filter(
            word => word.length > 1 && !stopWords.find(w => word === w)
          )
      };
    }
  );

  var topWords = groupTopWordsFromTweets(tweets);

  topWords = topWords.map(
    tw => {
      const word = tw[0];
      // find tweets that have this word
      const matchingTweets = tweets.filter(
        tw => tw.meaningful_words.find(w => w === word)
      );
      const topMatchingWords = groupTopWordsFromTweets(matchingTweets)
        // filter for only words that are in our topWords list, and not the current word
        .filter(
          tmw => topWords.find(tw => tw[0] === tmw[0]) && tmw[0] !== word
        );

      return [
        ...tw,
        topMatchingWords
      ];
    }
  );

  console.log(topWords);

  return tweets;
}

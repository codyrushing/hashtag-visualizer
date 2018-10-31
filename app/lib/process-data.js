import { english, spanish } from 'stopwords';

// additional stopwords can be added here
const stopWords = english
  .concat(spanish)
  .concat([
    'cc',
    'via'
  ]);

const n = 20;

/*
returns an array structured as such
[
  [
    '#bigdata', // word itself
    33 // # of times it is used
  ],
  ...
]
*/
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
  // reduce through words and create an array
  .reduce(
    (acc, v) => {
      v = v.toLowerCase();
      const matchingWord = acc.find(w => w[0] === v);
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
  .slice(0, n);

export default function(tweets, query)  {
  // extract meaningful words for each tweet, and save them to `meaningful_words` key on object
  tweets = tweets.map(
    tw => {
      return {
        ...tw,
        meaningful_words: tw.full_text.toLowerCase()
          // remove links, html entities, @mentions, numbers
          .replace(/[^A-z0-9@#]|(http\S+)|(&*\S*;)|(@\S+)|(\b\d+\b)/ig, ' ')
          .split(' ')
          // filter words that are one character long, and any stopwords, and the current query
          .filter(
            word => word.length > 1 && !stopWords.concat([query]).find(w => word === w)
          )
      };
    }
  );

  // get the top words from tweets
  var topWords = groupTopWordsFromTweets(tweets);

  /*
  traverse the topWords, and for each word, get all the tweets that use that word,
  and construct a nested topWords array and added to each of the original item as the third index:
  [
    [
      '#bigdata', // word itself
      33, // # of times it is used
      [
        [
          '#ai',
          8
        ],
        [
          '#machinelearning',
          5
        ],
        ...
      ]
    ],
    ...
  ]
  */
  topWords.forEach(
    tw => {
      const word = tw[0];
      // find tweets that have this word
      const matchingTweets = tweets
        .filter(
          tw => !!tw.meaningful_words.find(w => w === word)
        );
      // add a third item which is another list of topwords
      tw[2] = groupTopWordsFromTweets(matchingTweets)
        // filter for only words that are in our topWords list, and not the current word
        .filter(
          tmw => !!topWords.find(tw => tw[0] === tmw[0]) && tmw[0] !== word
        );
    }
  );

  // precompute some maps to get from name => index and visa versa
  const indexByName = new Map();
  const nameByIndex = new Map();
  topWords.forEach(
    (tw, i) => {
      const name = tw[0];
      indexByName.set(name, i);
      nameByIndex.set(i, name);
    }
  );

  // construct a square matrix representing the network dependencies of each word to other top words (https://github.com/d3/d3-chord#_chord)
  const matrix = [];
  topWords.forEach(
    (tw, i) => {
      const subWords = tw[2];
      let row = matrix[i];
      // create matrix row if not exists
      if(!row){
        row = matrix[i] = Array.from({ length: topWords.length }).fill(0);
      }
      // traverse through subwords to populate row
      tw[2].forEach(
        w => {
          row[indexByName.get(w[0])] = w[1]
        }
      );
    }
  );

  return {
    tweets,
    indexByName,
    nameByIndex,
    matrix
  };
}

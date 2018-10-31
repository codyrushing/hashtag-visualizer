# Twitter text visualization project
This is a data visualization project exploring text characteristics of tweets for a given query.  It uses Twitter's standard search API to fetch up to 100 tweets from the last 7 days.  The top 20 most used words (excluding common stopwords, urls, @mentions, numbers, and the current query term) are determined and displayed on a chord network chart drawn with [d3.js](https://d3js.org/).  For each of those top 20 words, the visualization shows how tweets using that given word also used other top words.  Basically, it allows you to see which common terms were tweeted together for a given twitter search.  The app starts with the query "#iot", but you can enter any search query you like.

## Installation
Requires node.js v8.x or greater.
1. Clone the repo
2. `npm install` to install dependencies
3. `npm start` to start the development server on port 8000.  It should launch a browser tab automatically.

### You will be prompted for a password to use this app
Because this is a public repo, the Twitter API credentials it uses are encrypted.  You will be prompted to enter a passcode when you start the app which will be used to decrypt the credentials and communicate with the Twitter API.  The passcode is the name of a cool IoT company in Austin :)

### More technical details
* Built with React.
* Transpiled with Babel.
* Visualization drawn with [d3.js](https://d3js.org/).
* Uses [budo](https://github.com/mattdesl/budo), a rapid development server that uses browserify to bundle client side js.
* Less to compile CSS.

Because Twitter does not enable CORS, the API requests have to be made on the server side.  That is implemented in a piece of middleware in `twitter-proxy.js`.  It accepts all requests that begin with `/twitter` and forwards them along to the Twitter API.  The front end adds an 'app-password' header to all `/twitter` requests, which the middleware uses to decrypt the API credentials.

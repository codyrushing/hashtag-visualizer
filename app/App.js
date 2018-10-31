import React, { Component } from 'react';
import { appPasswordKey } from './lib/constants';
import PasswordForm from './components/PasswordForm';
import SearchForm from './components/SearchForm';
import VizContainer from './components/VizContainer';
import { verifyPassword, searchTweets } from './lib/api';
import processData from './lib/process-data';

export default class App extends Component {
  componentWillMount(){
    this.checkForValidCredentials = this.checkForValidCredentials.bind(this);
    this.loadTweets = this.loadTweets.bind(this);
    this.setState({
      hasValidCredentials: false,
      query: null,
      tweets: []
    });
    this.checkForValidCredentials();
  }
  async checkForValidCredentials(){
    const appPassword = this.getAppPassword();
    if(appPassword){
      this.setState({
        validatingPassword: true
      })
      try {
        const response = await verifyPassword(appPassword);
        this.setState({
          error: null,
          hasValidCredentials: true
        });
      }
      catch(err){
        err = await err.json();
        this.setState({
          hasValidCredentials: false,
          error: err.err
        });
      }
      this.setState({
        validatingPassword: false
      });
    }
  }
  async loadTweets(query){
    try {
      this.setState({
        loading: true
      });
      const response = await searchTweets(query);
      // const tweets = processData(response.statuses);
      this.setState({
        query,
        tweets: response.statuses,
        loading: false
      });
    }
    catch(err){
      console.error(err);
      if(typeof err.json === 'function'){
        err = await err.json();
        err = err.err;
      }
      this.setState({
        error: err,
        loading: false
      });
    }
  }
  getAppPassword(){
    return window.localStorage.getItem(appPasswordKey);
  }
  render(){
    const { error, validatingPassword } = this.state;
    return (
      <div>
        {error && <span className="error">{error}</span>}
        {validatingPassword && (<p>Validating password</p>)}
        {this.renderInner()}
      </div>
    )
  }
  renderInner(){
    const { hasValidCredentials } = this.state;
    if(!hasValidCredentials){
      return (
        <PasswordForm
          submitHook={this.checkForValidCredentials} />
      );
    }
    return this.renderAuthorized();
  }
  renderAuthorized(){
    const { loading } = this.state;
    return (
      <div className={`app authorized ${loading ? 'loading' : ''}`}>
        <SearchForm submitHook={this.loadTweets} {...this.state} />
        <VizContainer {...this.state} />
      </div>
    );
  }
}

import React, { Component } from 'react';
import { appPasswordKey } from './lib/constants';
import PasswordForm from './components/PasswordForm';
import SearchForm from './components/SearchForm';
import Visualizer from './components/Visualizer';
import { verifyPassword, searchTweets } from './lib/api';

export default class App extends Component {
  componentWillMount(){
    this.checkForValidCredentials = this.checkForValidCredentials.bind(this);
    this.loadTweets = this.loadTweets.bind(this);
    this.setState({
      hasValidCredentials: false
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
      const response = await searchTweets(query);
      this.setState({
        tweets: response.statuses
      });
    }
    catch(err){
      err = await err.json();
      this.setState({
        error: err.err
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
    const { tweets=[] } = this.state;
    return (
      <div className="authorized">
        <SearchForm submitHook={this.loadTweets} />
        <Visualizer data={tweets} />
      </div>
    );
  }
}

import React, { Component } from 'react';
import TwitterClient from './lib/twitter-client';
import { appPasswordKey } from './lib/constants';
import PasswordForm from './components/PasswordForm';

export default class App extends Component {
  componentWillMount(){
    this.onSubmitPasswordForm = this.onSubmitPasswordForm.bind(this);
    const hasCredentials = !!this.getAppPassword();
    this.setState({
      hasCredentials
    });
    if(hasCredentials){
      this.initTwitterClient();
    }
  }
  getAppPassword(){
    return !!window.localStorage.getItem(appPasswordKey);
  }
  initTwitterClient(){
    try {
      this.twitterClient = new TwitterClient();
      this.twitterClient.getAccessToken().then(console.log);
      console.log(this.twitterClient);
    }
    catch(err) {
      console.error(err);
      this.setState({
        hasCredentials: false
      });
    }
  }
  onSubmitPasswordForm(){
    this.initTwitterClient();
    this.forceUpdate();
  }
  render(){
    const { hasCredentials } = this.state;
    if(!hasCredentials){
      return (
        <PasswordForm
          onSubmit={this.onSubmitPasswordForm}/>
      );
    }
    return (
      <h1>Hey hey</h1>
    );
  }
}

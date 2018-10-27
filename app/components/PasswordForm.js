import React, { Component } from 'react';
import { appPasswordKey } from '../lib/constants';

export default class PasswordForm extends Component {
  componentWillMount(){
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  onSubmit(e){
    const { onSubmit } = this.props;
    e.preventDefault();
    window.localStorage.setItem(appPasswordKey, this.state.password);
    if(typeof onSubmit === 'function'){
      onSubmit();
    }
  }
  handleChange(e){
    e.preventDefault();
    this.setState({
      password: e.target.value
    });
  }
  render(){
    return (
      <form
        className="password-form"
        onSubmit={this.onSubmit}>
        <h3>Enter your passcode to start the app</h3>
        <input onChange={this.handleChange} autoComplete="new-password" type="password" className="password-input" />
      </form>
    )
  }
}

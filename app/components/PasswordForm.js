import React, { Component } from 'react';
import { appPasswordKey } from '../lib/constants';
import { verifyPassword } from '../lib/api';

export default class PasswordForm extends Component {
  componentWillMount(){
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  async onSubmit(e){
    const { submitHook } = this.props;
    e.preventDefault();
    window.localStorage.setItem(appPasswordKey, this.state.password);
    if(typeof submitHook === 'function'){
      submitHook(this.state.password);
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
        <div className="form-row">
          <input onChange={this.handleChange} autoComplete="new-password" type="password" className="password-input" />
          <button type="submit">Go</button>
        </div>
      </form>
    )
  }
}

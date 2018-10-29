import React, { Component } from 'react';

export default class PasswordForm extends Component {
  render(){
    return (
      <div
        className="visualizer">
        {this.props.data.length} tweets
      </div>
    )
  }
}

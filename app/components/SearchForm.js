import React, { Component } from 'react';
import { appPasswordKey } from '../lib/constants';
import { verifyPassword } from '../lib/api';

export default class SearchForm extends Component {
  componentWillMount(){
    this.setState({
      query: '#iot'
    });
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount(){
    this.onSubmit();
  }
  async onSubmit(e){
    const { submitHook } = this.props;
    if(e){
      e.preventDefault();
    }
    if(typeof submitHook === 'function'){
      submitHook(this.state.query);
    }
  }
  handleChange(e){
    e.preventDefault();
    this.setState({
      query: e.target.value
    });
  }
  render(){
    const { loading, tweets, query } = this.props;
    return (
      <form
        className="search-form"
        onSubmit={this.onSubmit}>
        <div className="form-row">
          <input
            onChange={this.handleChange}
            type="text"
            value={this.state.query}
            className="search-input" />
          <button type="submit">Go</button>
        </div>
        <p>
          {
            loading
            ? <span>Loading...</span>
            : <span><strong>{tweets.length}</strong> recent tweets found for "{query}"</span>
          }
          &nbsp;
        </p>
      </form>
    )
  }
}

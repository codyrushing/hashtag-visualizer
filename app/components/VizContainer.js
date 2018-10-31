import React, { Component } from 'react';
import TweetChordChart from '../viz/tweet-chord-chart';

export default class VizContainer extends Component {
  constructor(props){
    super(props);
    this.container = React.createRef();
  }
  componentDidMount(){
    this.chart = new TweetChordChart(
      this.container.current,
      {}
    );
  }
  componentDidUpdate(){
    const { tweets, query} = this.props;
    if(this.chart){
      this.chart.update(tweets, query);
    }
  }
  render(){
    const { tweets, query, loading } = this.props;
    return (
      <section className="viz-section">
        <div
          ref={this.container}
          className="viz-container" />
      </section>
    );
  }
}

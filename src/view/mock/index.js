import React, { Component } from 'react'
import ajax from '@util/ajax';

export default class Home extends Component {
  constructor (props, context) {
    super(props)
    this.state = {
      productAll: []
    }
  }

  // mock数据
  getProductAll = () => {
    ajax('getAuthInfo').then((res) => {
      this.setState({productAll: res})
    });
  }

  render () {
    const { productAll } = this.state
    return (
      <div className="home-wrap mock">
        <div className="test">mock数据</div>
        <div className="test" onClick={this.getProductAll}>getProductAll - mock</div>
        <ul>
          {productAll.map(obj => {
            return <li key={obj.id}>{obj.title}</li>
          })}
        </ul>
      </div>
    )
  }
}

import React, { Component } from 'react'
import { Button } from 'antd'
import { connect } from 'react-redux'
import { actions as appleActions } from '@src/store/modules/apple'
import { actions as orangeActions } from '@src/store/modules/orange'

class ReduxTest extends Component {
  constructor (props, context) {
    super(props)
    this.state = {}
  }

  render () {
    const { appleCount, orangeCount, incrementAppleCount, incrementOrangeCount } = this.props
    return (
      <div className="home-wrap">
        <div>redux测试</div>
        <div style={{ margin: '10px 0' }}>
          <Button type="primary" onClick={() => incrementAppleCount(1)}>incrementAppleCount</Button>
          <span>{ appleCount }</span>
        </div>
        <div>
          <Button type="primary" onClick={() => incrementOrangeCount(1)}>incrementOrangeCount</Button>
          <span>{ orangeCount }</span>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    appleCount: state.apple.count,
    orangeCount: state.orange.count
  }
}

const mapDispatchToProps = dispatch => {
  return {
    incrementAppleCount: (count) => {
      dispatch(appleActions.incrementCount(count))
    },
    incrementOrangeCount: (count) => {
      dispatch(orangeActions.incrementCount(count))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReduxTest)

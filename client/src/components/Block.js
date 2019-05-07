import React, { Component } from 'react'

export default class Block extends Component {
  render() {
      const { timestamp, hash, data } = this.props.block;
      const stringifyData = JSON.stringify(data);

      const dataDisplay = `${stringifyData.substring(0, 15)}...`;
    return (
      <div>
          <div>
            Timestamp: {new Date(timestamp).toLocaleString()}
          </div>
          <div>
             Hash: {hash}
          </div>
          <div>
            Data: {dataDisplay}
          </div>
      </div>
    )
  }
}

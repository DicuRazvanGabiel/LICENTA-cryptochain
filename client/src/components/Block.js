import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import Transaction from './Transaction'

export default class Block extends Component {
  state = { displayTransaction: false } 

  togleTransaction = () => {
    this.setState({ displayTransaction: !this.state.displayTransaction });
  }

  get displayTransaction() {

    const { data } = this.props.block
    const stringifyData = JSON.stringify(data);

    const dataDisplay = `${stringifyData.substring(0, 35)}...`;

    if(this.state.displayTransaction){
      return (
        <div>
          {stringifyData}
          <br />
          <Button bsStyle="danger" bsSize="small" onClick={this.togleTransaction}>Show less</Button>
        </div>
      );
    }

    return (
      <div>
        <div>
          {
            data.map(transaction => (
              <div key={transaction.id}>
              <hr/>
                <Transaction transaction={transaction}/>
              </div>
            ))
          }
        </div>
      </div>
    );
  }

  render() {
      const { timestamp, hash } = this.props.block;
      
    return (
      <div>
          <div>
            Timestamp: {new Date(timestamp).toLocaleString()}
          </div>
          <div>
             Hash: {hash}
          </div>
          {this.displayTransaction} 
      </div>
    )
  }
}

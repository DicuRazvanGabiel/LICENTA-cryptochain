import React, { Component } from "react";
import Block from './Block'

export default class Blocks extends Component {
  state = { blocks: [] };

  componentDidMount() {
    fetch("http://localhost:3000/api/blocks")
      .then(response => response.json())
      .then(json => this.setState({ blocks: json }));
  }

  render() {
    return (
      <div>
        {
          this.state.blocks.map(block => {
            return( 
              <div key={block.hash} className='Block'>
                <Block block={block}/>
              </div>
            )
        })
        }
      </div>
    );
  }
}

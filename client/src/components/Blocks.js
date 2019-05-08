import React, { Component } from "react";
import Block from './Block'
import { Link } from 'react-router-dom'

export default class Blocks extends Component {
  state = { blocks: [] };

  componentDidMount() {
    fetch(`${document.location.origin}/api/blocks`)
      .then(response => response.json())
      .then(json => this.setState({ blocks: json }));
  }

  render() {
    return (
      <div>
        <div>
          <Link to='/'>Home</Link>
        </div>
        <div>
          Blocks
        </div>
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

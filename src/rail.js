import React from 'react';
import ReactDOM from 'react-dom';
import './blockLayout.css'

class Rail extends React.Component {
  constructor(props) {
     super(props)
      this.state = {
         blocks: block { y-pos: 10},
      }
  }

  render() {
      return (
          <Block id="props.blocks."></Block>
      );
  }
}

class Block extends React.Component {
    constructor(props) {
      super(props);
      this.state = {y_pos: props.y_pos, y_max: 1000};
    }
  
    render() {
      return (<div className="block" style={{top: this.props.value.y_pos + 'px'}} /*onKeyPress=""*/ /*onClick={() => {this.update()}}*/>O</button>);
    }
  
    // update() {
    //   if (this.state.y_pos >= this.state.y_max) {
    //     //remove
    //   }
    //   this.setState({y_pos: this.state.y_pos + 10,});
    // }
  
  
}


ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

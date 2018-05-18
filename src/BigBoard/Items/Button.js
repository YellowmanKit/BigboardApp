import React, { Component } from 'react';
import './Item.css';

class Button extends Component {

  buttonClicked(event){
    event.preventDefault();
    this.props.onButtonClicked(this.props.buttonCell);
  }

  render(){
    let btn = this.props.style?
    <button style={this.props.style} onClick={this.buttonClicked.bind(this)} />:
    <button className={this.props.buttonClassName} onClick={this.buttonClicked.bind(this)} />;

    return(
      <div>
        {btn}
      </div>
    )
  }

}

export default Button;

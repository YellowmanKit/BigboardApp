import React, { Component } from 'react';
import './Item.css';
import mask from '../Images/mask.png';
import Button from './Button';

class Modal extends Component {

  buttonClicked(event){
    event.preventDefault();
  }

  render(){

    let modalStyle = {
      width: '100%',
      height: this.props.h + 'px',
      backgroundImage: "url(" + mask + ")",
      position: 'absolute',
      left: 0,
      top: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start'
    }

    let buttons =
    this.props.status === 'waitForConfirm'?
    <div className="ConfirmButtonsArea">
      <Button buttonClassName="confirmButton" buttonCell={false} onButtonClicked={this.props.onConfirm}/>
      <Button buttonClassName="cancelButton" buttonCell={false} onButtonClicked={this.props.onCancel}/>
    </div>:
    this.props.status === 'uploading'?
    <div className="ConfirmButtonsArea"/>:
    this.props.status === 'uploaded'?
    <div className="ConfirmButtonsArea">
      <Button buttonClassName="confirmButton" buttonCell={false} onButtonClicked={this.props.onConfirm}/>
    </div>:
    this.props.status === 'confirmLogout'?
    <div className="ConfirmButtonsArea">
      <Button buttonClassName="confirmButton" buttonCell={false} onButtonClicked={this.props.onConfirm}/>
      <Button buttonClassName="cancelButton" buttonCell={false} onButtonClicked={this.props.onCancel}/>
    </div>:
    this.props.status === 'confirmDeleteImage'?
    <div className="ConfirmButtonsArea">
      <Button buttonClassName="confirmButton" buttonCell={false} onButtonClicked={this.props.onConfirm}/>
      <Button buttonClassName="cancelButton" buttonCell={false} onButtonClicked={this.props.onCancel}/>
    </div>:
    <div className="ConfirmButtonsArea">
      <Button buttonClassName="cancelButton" buttonCell={false} onButtonClicked={this.props.onCancel}/>
    </div>;

    let message =
    this.props.status === 'waitForConfirm'?
    <p className="ModalMessage">
      儲存更改?
    </p>:
    this.props.status === 'uploading'?
    <p className="ModalMessage">
      儲存中，請稍等...
    </p>:
    this.props.status === 'uploaded'?
    <p className="ModalMessage">
      已成功更改!
    </p>:
    this.props.status === 'failed'?
    <p className="ModalMessage">
      上傳失敗，請再試一次!
    </p>:
    this.props.status === 'confirmLogout'?
    <p className="ModalMessage">
        確定登出?
        登出前請<font color='red'>保存編輯!</font>
    </p>
    :

    this.props.status === 'confirmDeleteImage'?
    <p className="ModalMessage">
      確定移除圖片{this.props.imgName}?
    </p>:
    '';

    return(
      <div style={modalStyle}>
        <div className="dialogBox">

            {message}

            {buttons}
        </div>
      </div>
    )
  }

}

export default Modal;

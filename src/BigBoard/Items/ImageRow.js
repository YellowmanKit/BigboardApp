import React, { Component } from 'react';
import './Item.css';
import Button from './Button'
import DeleteBtnImg from '../Images/Bigboard_situation_trash.png';
import ComfirmBtnImg from '../Images/Bigboard_situation_confirm.png';
import Modal from './Modal';

class ImageRow extends Component {

  constructor(props){
    super(props);
    this.state={
      //confirmDelete: false
      showModal: false,
      modalStatus: 'none'
    }
  }

  onControlButtonUpClicked=()=>{
    this.props.buttonHandler.onUpImgBtnClicked(this.props.imageCell);
  }

  onControlButtonDownClicked=()=>{
    this.props.buttonHandler.onDownImgBtnClicked(this.props.imageCell);
  }

  onControlButtonRemoveClicked = ()=>{
    this.setState({
      modalStatus: 'confirmDeleteImage',
      showModal: true
    })
  }

  onModalConfirmButtonPressed(){
    this.props.buttonHandler.onRemoveImgBtnClicked(this.props.imageCell);
    this.setState({
      modalStatus: 'none',
      showModal: false
    });
  }

  onModalCancelButtonPressed(){
    this.setState({
      modalStatus: 'none',
      showModal: false
    });
  }

  /*onControlButtonRemoveClicked = ()=>{
    if(this.state.confirmDelete){
      this.setState({
        confirmDelete: false
      })
      this.props.buttonHandler.onRemoveImgBtnClicked(this.props.imageCell);
    }else{
      this.setState({
        confirmDelete: true
      })
      setTimeout(()=>{this.setState({confirmDelete: false})}, 1000);
    }
  }*/

  getImageSource(){
    let _previewImg = this.previewImg;
    if(this.props.imageCell.imgFile.name){

      //console.log("Loading img file");
      let reader  = new FileReader();
      reader.addEventListener("load", function () {
        _previewImg.src = reader.result;
      }, false);
      reader.readAsDataURL(this.props.imageCell.imgFile);

    }else if(this.props.imageCell.downloadedImg){

      //console.log("Loading downloadedImg");
      var reader  = new window.FileReader();
      reader.addEventListener("load", function () {
        _previewImg.src = reader.result;
      }, false);
      reader.readAsDataURL(this.props.imageCell.downloadedImg);

    } else if(this.props.imageCell.img) {
      _previewImg.src = this.props.imageCell.img;
    }
  }

  componentDidMount(){
    this.getImageSource();
  }

  componentDidUpdate(){
    this.getImageSource();
  }

  cutFileNameTimestamp(){
    //console.log(this.props.imageCell.name);
    var array1 = this.props.imageCell.name.split('.');
    var array2 = this.props.imageCell.name.split('-');
    var displayName = (array2.length > 1?array2[0]:array1[0]) + '.' + array1[1];
    return String(displayName);
  }

  render(){

    let modal =
    this.state.showModal?
    <Modal
    h={this.props.h}
    status={this.state.modalStatus}
    onConfirm={this.onModalConfirmButtonPressed.bind(this)}
    onCancel={this.onModalCancelButtonPressed.bind(this)}
    imgName={this.cutFileNameTimestamp()}
    />:
    null;

    let deleteBtnStyle =  {
      height: '100px',
      width: '100px',

      background: !this.state.confirmDelete? 'url(' + DeleteBtnImg + ')' : 'url(' + ComfirmBtnImg + ')',
      border: 'none',

      cursor: 'pointer'
    }

    return(
      <div className="ImageRow">

        {modal}

        <img className="RowImage" alt="" ref={(img) => { this.previewImg = img; }} />
        <div className="ImageName">{this.cutFileNameTimestamp()}</div>
        <div className="Control">
          <Button buttonClassName="ControlButtonUp" buttonCell={false} onButtonClicked={this.onControlButtonUpClicked.bind(this)}/>
          <Button buttonClassName="ControlButtonDown" buttonCell={false} onButtonClicked={this.onControlButtonDownClicked.bind(this)}/>
          <Button style={deleteBtnStyle} buttonCell={false} onButtonClicked={this.onControlButtonRemoveClicked.bind(this)}/>
        </div>
      </div>
    )
  }

}

export default ImageRow;

import React, { Component } from 'react';
import './BigBoard.css';
import Content from './Content/Content';
import Background from './Images/bg_new.jpg';
import Modal from './Items/Modal';
import axios from 'axios';

import bigboardIcon from './Images/Bigboard_title_icon.png';
import memoriesIcon from './Images/Memoryleisure_icon.png';
import bedsideIcon from './Images/bedsideassistance_title_icon.png';

//const apiServer = 'http://localhost:8004/api/';
const apiServer = 'http://10.0.48.21:8004/api/';

class BigBoard extends Component {

  constructor(props){
    super(props);
    this.state = {
      catagory: 3,
      height: 0,
      logStatus: {
        loginFailed: false,
        logged: false,
        login: this.login.bind(this)
      },
      checkFolderStatus: {
        checkFolder: false,
        folderToCheck:{}
      },
      extraHeight: 0,
      showModal: false,

      modalStatus: 'none',
      updateDone: false,
      fileUploadDone: false,
      error:false,

      timeOptionTypeToUpload: 0,
      appName: '',
      jsonToUpload: {},
      filesToUpload: []

    }
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions.bind(this));
  }

  updateWindowDimensions() {
    this.setState({ height: window.innerHeight });
  }

  login(password){
    axios.get(apiServer + 'login/' + password).then(res=>{
      //console.log(res);
      this.setState({
        logStatus:{
          loginFailed: !res.data.verified,
          logged: res.data.verified,
          login: this.login.bind(this)
        }
      });
      if(res.data.verified){
        //console.log("Login succeed");
      }else{
        //window.alert("密碼錯誤");
      }
    });
  }

  logout(){
    window.location.reload()
    /*this.setState({
      logStatus:{
        loginFailed: false,
        logged: false,
        login: this.login.bind(this)
      }
    })*/
  }

  handleTopRightButton(event){
    if(this.state.checkFolderStatus.checkFolder === true){
      this.setState({
        checkFolderStatus: {
          checkFolder: false,
          folderToCheck:{}
        },
        extraHeight: 0
      })
    } else{
      this.setState({
        showModal: true,
        modalStatus: 'confirmLogout'
      });
    }
  }

  onFolderSelected(folder){
    this.setState({
      checkFolderStatus: {
        checkFolder: true,
        folderToCheck:folder
      },
      extraHeight: (folder.imageCells.length - 1) * 250
    })
  }

  getBoardHeight(){
    let h =  this.state.extraHeight > 0? this.state.height + this.state.extraHeight: this.state.height;
    return '' + h;
  }

  onUpload(){

    this.setState({
      updateDone: false,
      fileUploadDone: false
    });

    var bigboard = this.state.jsonToUpload;
    bigboard.delayTime = this.sliderTypeToTime(this.state.timeOptionTypeToUpload);
    bigboard.timeStamp = String(Date.now());
    //console.log(this.state.timeOptionType);
    var dictstring = JSON.stringify(bigboard);

    axios.post(apiServer + 'update/' + this.state.appName + '.json/' + dictstring).then(res=>{
      //console.log("updated");
      this.setState({
        updateDone: true
      });
    }).catch(err=>{
      this.setState({
        error: true
      });
      console.log("Failed to update",err);
    })

    let files = new FormData();

    this.state.filesToUpload.map(f=>{
      files.append('files',f);
      return null;
    })

    //console.log(this.state.filesToUpload);
    axios.post(apiServer + 'upload', files).then(res=>{
      //console.log("File uploaded");
      this.setState({
        filesToUpload: [],
        fileUploadDone: true
      })
    }).catch(err=>{
      this.setState({
        error: true
      });
      console.log("Failed to upload file",err);
    })
  }

  onUploadButtonPressed(_json,_appName,_filesToUpload,_timeOptionType){
    console.log(_json);
    this.setState({
      modalStatus: 'waitForConfirm',
      showModal: true,
      timeOptionTypeToUpload: _timeOptionType,
      appName: _appName,
      jsonToUpload: _json,
      filesToUpload: _filesToUpload
    })
  }

  onModalConfirmButtonPressed(){
    if(this.state.modalStatus === 'waitForConfirm'){
      this.setState({
        modalStatus: 'uploading'
      })
      this.onUpload();
    }else if(this.state.modalStatus === 'confirmLogout'){
      this.logout();
      this.setState({
        modalStatus: 'none',
        showModal: false
      })
    }else {
      this.setState({
        modalStatus: 'none',
        showModal: false
      })
    }
  }

  onModalCancelButtonPressed(){
    this.setState({
      modalStatus: 'none',
      showModal: false
    })
  }

  componentWillUpdate(nextProps, nextState){
    if(nextState.updateDone && nextState.fileUploadDone){
      //console.log('uploaded!')
      this.setState({
        modalStatus: 'uploaded',
        updateDone: false,
        fileUploadDone: false
      });
    }else if(nextState.error){
      this.setState({
        modalStatus: 'failed',
        updateDone: false,
        fileUploadDone: false,
        error: false
      });
    }
  }

  sliderTypeToTime(type){
    switch(type){
      case 0:
        return 1;
      case 1:
        return 2;
      case 2:
        return 5;
      case 3:
        return 10;
      case 4:
        return 20;
      default:
        return 1;
    }
  }

  render() {

    let bigboardStyle = {
      width: '100%',
      height: this.getBoardHeight() + 'px',
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',

      backgroundImage: 'url(' + Background + ')',
      backgroundSize: 'cover'
    };

    let titleHead =
    this.state.catagory === 0? '':
    this.state.catagory === 1? '大壁報':
    this.state.catagory === 2? '回味影廊':
    this.state.catagory === 3? '床邊小助手(院社資訊)':
    '';

    let titleBody =
    this.state.checkFolderStatus.checkFolder? ' - ' + this.state.checkFolderStatus.folderToCheck.name:
    ''

    let title = titleHead + titleBody;

    let iconStyle = {
      minWidth: '75px',
      minHeight: '75px',
      marginTop: '0px',
      backgroundImage:
      this.state.catagory === 0? '':
      this.state.catagory === 1? 'url(' + bigboardIcon + ')':
      this.state.catagory === 2? 'url(' + memoriesIcon + ')':
      this.state.catagory === 3? 'url(' + bedsideIcon + ')':'',
      backgroundSize:'contain'
    }

    let titleArea =
    <div className="TitleArea">
      <div style={iconStyle}></div>
      <p className="title">{title}</p>
    </div>;

    let topLeftButton =
    <button className="topRightButton" onClick={this.handleTopRightButton.bind(this)} />;


    let headerStyle = {
      width: '100%',
      height: '90px',
      backgroundColor: 'grey',
      //this.state.catagory === 1 ?'#af1f28':
      //this.state.catagory === 2 ?'#17ada1':
      //'#073f56',
      display: 'flex',
      justifyContent: 'center'
    }

    let header =
    this.state.logStatus.logged?
    <header style={headerStyle}>{topLeftButton}{titleArea}</header>:
    <div></div>;

    let modal =
    this.state.showModal?
    <Modal
    h={this.getBoardHeight()}
    status={this.state.modalStatus}
    onConfirm={this.onModalConfirmButtonPressed.bind(this)}
    onCancel={this.onModalCancelButtonPressed.bind(this)}/>:
    null;

    return (
      <div style={bigboardStyle}>
        {header}

        <Content
        apiServer={apiServer}
        loginFailed={this.state.logStatus.loginFailed}
        onUploadButtonPressed={this.onUploadButtonPressed.bind(this)}
        catagory={this.state.catagory}
        logStatus={this.state.logStatus}
        onFolderSelected={this.onFolderSelected.bind(this)}
        checkFolderStatus={this.state.checkFolderStatus}
        height={this.getBoardHeight() - 90}/>

        {modal}
      </div>
    );

  }

}

export default BigBoard;

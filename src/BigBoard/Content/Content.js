import React, { Component } from 'react';
import axios from 'axios';
import './Content.css';
import Button from '../Items/Button';
import ImageRow from '../Items/ImageRow';
import BG_Bigboard from '../Images/Bigboard_loginbg.png';
import BG_Memories from '../Images/Memoryleisure_loginbg.png';
import BG_Bedside from '../Images/bedsideassistance_loginbg.png';

class Content extends Component {

  constructor(props){
    super(props);
    this.state = {
      noPassword: false,

      loaded: false,
      bigboard:{},
      appName:
      props.catagory === 1? 'bigboard':
      props.catagory === 2? 'memories':
      'bedside',

      timeOption:['1秒','2秒','5秒','10秒','20秒'],
      timeOptionType: 0,

      filesToUpload: []
    }

    this.getAppState();
  }

  getAppState(){
    axios.get(this.props.apiServer + 'download/' + this.state.appName + '.json').then(res=>{
      this.setState({
        loaded: true,
        bigboard: res.data,
        timeOptionType: this.sliderTimeToType(res.data.delayTime)
      })
      //console.log(this.state.bigboard);
    }).then(()=>{
      //console.log("Downloading image...");
      this.state.bigboard.Folders.map(folder=>{
        folder.imageCells.map(cell=>{
          axios.get(this.props.apiServer + 'download/' + cell.name, { responseType:"blob" }).then(res=>{
            //console.log(cell.name + " downloaded");
            cell.downloadedImg = res.data;
          });
          return null;
        })
        return null;
      })
    })

  }

  passwordSubmitted(event){
    event.preventDefault();
    let pw = document.getElementById("pw").value;
    if(pw !== ""){
      this.props.logStatus.login(pw);
      this.setState({
        noPassword: false
      })
    }else{
      this.setState({
        noPassword: true
      });
    }
  }

  getSliderTime(sliderTimeType){
    return this.state.timeOption[sliderTimeType];
  }

  handleSelectSliderTimeType(event){
    this.setState({
      timeOptionType: this.state.timeOption.indexOf(event.target.value)
    })
  }

  sliderTimeToType(time){
    switch(time){
      case 1:
        return 0;
      case 2:
        return 1;
      case 5:
        return 2;
      case 10:
        return 3;
      case 20:
        return 4;
      default:
        return 0;
    }
  }

  onAddContentButtonPressed(event){
    if(event.target.files.length > 0){
      for(var i=0;i<event.target.files.length;i++){

        let file = event.target.files[i];
        var blob = file.slice(0, file.size, file.type);
        var newFile = new File([blob], this.processFilename(file.name) , {type: file.type});

        //console.log(newFile.name);
        let newImgCell = {
          name: newFile.name,
          imgFile: newFile
        }
        this.state.filesToUpload.push(newFile);
        //console.log(this.state.filesToUpload);
        //this.props.checkFolderStatus.folderToCheck.imageCells.push(newImgCell);
        this.props.checkFolderStatus.folderToCheck.imageCells.splice(0,0,newImgCell);
      }
      this.props.onFolderSelected(this.props.checkFolderStatus.folderToCheck);
      //this.forceUpdate();
    }
  }

  processFilename(oldname){
    var array = oldname.split('.');
    var newName = array[0] + '-' + this.getTimestamp() + '.' + array[1];
    return newName;
  }

  getTimestamp(){
    var date = new Date();
    return date.getTime();
  }

  onUpImgBtnClicked(imgCell){
    let cells = this.props.checkFolderStatus.folderToCheck.imageCells;
    let index = cells.indexOf(imgCell);
    if(index <= 0){
      return;
    }
    var temp = cells[index];
    cells[index] = cells[index-1];
    cells[index-1] = temp;

    this.forceUpdate();
  }

  onDownImgBtnClicked(imgCell){
    let cells = this.props.checkFolderStatus.folderToCheck.imageCells;
    let index = cells.indexOf(imgCell);
    if(index === cells.length - 1){
      return;
    }
    var temp = cells[index];
    cells[index] = cells[index+1];
    cells[index+1] = temp;
    this.forceUpdate();
  }

  onRemoveImgBtnClicked(imgCell){
    this.props.checkFolderStatus.folderToCheck.imageCells.splice(this.props.checkFolderStatus.folderToCheck.imageCells.indexOf(imgCell),1);
    axios.get(this.props.apiServer + 'delete/' + imgCell.name);
    this.forceUpdate();
  }

  onUploadButtonPressed(){
    this.props.onUploadButtonPressed(this.state.bigboard,this.state.appName,this.state.filesToUpload,this.state.timeOptionType);
  }

  render() {

    window.oncontextmenu = function(event) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    };

    if(!this.state.loaded){
      return <div/>
    }

    let _buttonHandler = {
      onUpImgBtnClicked: this.onUpImgBtnClicked.bind(this),
      onDownImgBtnClicked: this.onDownImgBtnClicked.bind(this),
      onRemoveImgBtnClicked: this.onRemoveImgBtnClicked.bind(this)
    }

    let contentStyle = {
      width: '100%',
      height: this.props.height,
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'nowrap'
    }

    if(this.props.checkFolderStatus.checkFolder){

      let imagesList = this.props.checkFolderStatus.folderToCheck.imageCells.map(imgCell=>{
        return(
        <ImageRow
        h={this.props.height + 90}
        key={this.props.checkFolderStatus.folderToCheck.imageCells.indexOf(imgCell)}
        imageCell={imgCell} buttonHandler={_buttonHandler}/>
        );
      });

      return(
        <div style={contentStyle}>
          <div className="ContentArea">

            <form className="UploadedContentUpperArea" onChange={this.onAddContentButtonPressed.bind(this)} accept="image/jpeg, image/png" >
              <input className="addContentButton" type="file" id="files" multiple={true}/>
              <Button buttonClassName="uploadButton" buttonCell={false} onButtonClicked={this.onUploadButtonPressed.bind(this)}/>
            </form>

            <div className="UploadedContentArea">
              {imagesList}
            </div>

          </div>
        </div>
      );
    }

    if(this.props.logStatus.logged){

      let folders = this.state.bigboard.Folders.map(folder =>{
        return (
          <div className="folder" key={folder.name}>
            <Button buttonClassName="folderButton" buttonCell={folder} onButtonClicked={this.props.onFolderSelected}/>
            <em className="folderName">{folder.name}</em>
          </div>
        )
      })

      let typeOptions = this.state.timeOption.map(type=>{
        return <option key={type}>{type}</option>
      });

      return (
        <div style={contentStyle}>
          <div className="ContentArea">

            <div className="UpperArea">
              {this.props.catagory !== 3 && <div className="timeSelecter">
                <select className="selectTime" value={this.getSliderTime(this.state.timeOptionType)} onChange={this.handleSelectSliderTimeType.bind(this)}>
                  {typeOptions}
                </select>
              </div>}
              <Button buttonClassName="uploadButton" buttonCell={false} onButtonClicked={this.onUploadButtonPressed.bind(this)}/>
            </div>

            <div className="Folders">
              {folders}
            </div>

            <div className="Footer">
            </div>

          </div>
        </div>
      );
    }

    let loginContentStyle = {
      width: '550px',
      height: '400px',
      margin: 'auto',
      marginTop: '200px',

      backgroundImage:
      this.props.catagory === 1? "url(" + BG_Bigboard + ")":
      this.props.catagory === 2? "url(" + BG_Memories + ")":
      "url(" + BG_Bedside + ")",
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat'
    }

    let loginFailedMessage =
    this.state.noPassword? <div className="NoPasswordMessage"/>:
    this.props.loginFailed? <div className="LoginFailedMessage"/>:
    null;



    return (
      <div id='#container' style={contentStyle}>
        <div style={loginContentStyle}>
          <form className="LoginInfo" onSubmit={this.passwordSubmitted.bind(this)}>
            <input id="pw" className="password" type="password" placeholder="密碼"/>
            {loginFailedMessage}
            <input className="submitPassword" type="submit" value="" />
          </form>

        </div>
      </div>
    );
  }



}

export default Content;

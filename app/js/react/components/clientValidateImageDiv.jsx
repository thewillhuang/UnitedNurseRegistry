'use strict';
const React = require('react');
const galleryObjectAction = require('../actions/galleryObjectAction.js');
const Input = require('react-bootstrap').Input;
const Tags = require('./clientValidateTags.jsx');
const OverlayTrigger = require('react-bootstrap').OverlayTrigger;
const Tooltip = require('react-bootstrap').Tooltip;

let ImageDiv = React.createClass({

  propTypes: {
    photoData: React.PropTypes.string.isRequired,
    guid: React.PropTypes.string.isRequired,
    reactId: React.PropTypes.string.isRequired,
    data: React.PropTypes.object.isRequired,
    selected: React.PropTypes.bool
  },

  getInitialState: function() {
    return {
      display: 'none',
      checkColor: '#a8a8a8',
      categoryListString: '',
      categoryList: []
    };
  },

  componentWillReceiveProps: function(nextProps) {
// console.log('nextProps', nextProps);
    if (nextProps.selected) {
      this.setState({
        display: '',
        checkColor: '#00ACAC'
      });
    } else {
      this.setState({
        display: 'none',
        checkColor: '#a8a8a8'
      });
    }
  },

  handleClick() {
    this.toggleHide();
  },

  handleChange() {
    this.setState({
      categoryListString: this.refs.categoryListString.getValue()
    });
  },

  toggleHide() {
    if (this.state.display === 'none') {
      this.setState({
        display: '',
        checkColor: '#00ACAC'
      });
      galleryObjectAction.update(this.props.reactId, {
        selected: true
      });
    } else {
      this.setState({
        display: 'none',
        checkColor: '#a8a8a8'
      });
      galleryObjectAction.update(this.props.reactId, {
        selected: false
      });
    }
  },

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.categoryListString) {
      this.state.categoryList.push(this.state.categoryListString);
      galleryObjectAction.update(this.props.reactId, {
        categoryList: this.state.categoryList
      });
    }
    this.setState({
      categoryListString: ''
    });
  },

  launchViewer() {
    window.imageViewerLoadStudy(this.props.data.guid, this.props.data.type);
  },

  render() {
    // console.log(this.props.data);
    let tags = () => {
      // console.log('this.props.data.categoryList', this.props.data.categoryList);
      if (this.props.data.categoryList) {
        // console.log('tags loaded');
        var tagsArray = this.props.data.categoryList.map((value, key) => {
          return (
            <Tags array={this.props.data.categoryList} index={key} key={key} reactId={this.props.reactId} value={value}/>
          );
        });
        return tagsArray;
      }
    };
// var tags = this.props.data.categoryList.map((key, value)=>{
//   console.log(key);
//   console.log(value);
// });
    return (
      <div className='imageContainer' style={{position: 'relative', marginBottom: 40, boxShadow: '1px 1px 1px 1px rgba(0, 0, 0, 0.4)'}}>
        <OverlayTrigger placement='top' overlay={<Tooltip>Click to Launch Image Viewer</Tooltip>}>
        <img className='center-block' onClick={this.launchViewer} src={this.props.photoData} style={{cursor: 'pointer', position: 'relative', top: 0, left: 0, width: '100%'}}/>
        </OverlayTrigger>
        <OverlayTrigger overlay={ <Tooltip> Click to Deselect Item </Tooltip>} placement='top'>
          <div onClick={this.handleClick} style={{cursor: 'pointer', position: 'absolute', top: 0, width: '100%', height: '100%', left: 0, textAlign: 'center', background: 'rgba(0, 0, 0, 0.6)', zIndex: 2000, display: this.state.display}}>
            <i className="fa fa-check-circle-o fa-4x" onClick={this.handleClick} style={{cursor: 'pointer', color: '#00ACAC', position: 'relative', top: '40%'}}></i>
          </div>
        </OverlayTrigger>
        <p style={{color: '#00a1d3', overflow: 'hidden', margin: 5, width: '100%', wordWrap: 'break-word'}}>
          {this.props.data.originalFileName}
        </p>
        <div className="row" style={{marginTop: 2}}>
          {tags()}
        </div>
        <div className="row">
          <OverlayTrigger overlay={ <Tooltip> Click to Select Item </Tooltip>} placement='top'>
            <div className="col-md-2 col-sm-2 col-xs-2" style={{textAlign: 'center', top: 9, cursor: 'pointer'}}>
              <i className="fa fa-check-circle-o fa-2x" onClick={this.handleClick} style={{color: this.state.checkColor, marginLeft: '50%', cursor: 'pointer', textAlign: 'center'}}></i>
            </div>
          </OverlayTrigger>
          <OverlayTrigger overlay={ <Tooltip> Enter to add tags to resource </Tooltip>} placement='top'>
            <div className="col-md-9 col-sm-9 col-xs-9">
              <form onSubmit={this.handleSubmit}>
                <Input onChange={this.handleChange} placeholder='add tags' ref='categoryListString' type='text' value={this.state.categoryListString}/>
              </form>
            </div>
          </OverlayTrigger>
        </div>
      </div>
    );
  }

});

module.exports = ImageDiv;

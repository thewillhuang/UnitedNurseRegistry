'use strict';
const React = require('react');
const galleryObjectAction = require('../actions/galleryObjectAction.js');
const galleryStore = require('../stores/galleryStore.js');
const ImageDiv = require('./clientValidateImageDiv.jsx');
const Button = require('react-bootstrap').Button;
const ButtonToolbar = require('react-bootstrap').ButtonToolbar;
// const OverlayTrigger = require('react-bootstrap').OverlayTrigger;
// const Tooltip = require('react-bootstrap').Tooltip;

let ClientValidateView = React.createClass({

  getInitialState() {
    return {
      gallery: galleryStore.getAll(),
      acceptAll: ' disabled',
      addSelected: ' disabled',
      selectButtonString: 'Select All'
    };
  },

  componentDidMount() {
    galleryObjectAction.getAll();
    galleryStore.addChangeListener(this._onChange);
  },

  componentWillUnmount(){
    galleryStore.removeChangeListener(this._onChange);
  },

  acceptAll(){
    // console.log(this.state.gallery);
    // for (var i = 0; i < this.state.gallery.length; i++) {
    //   galleryObjectAction.transferToInbox(this.state.gallery[i].objectGuid, this.state.gallery[i].reactId);
    // }
    this.state.gallery.map((value) => {
      // console.log(value);
      galleryObjectAction.transferToInbox(value.objectGuid, value.reactId, value.categoryList);
    });
    // galleryObjectAction.addAll();
  },

  _onChange() {
    this.setState({
      gallery: galleryStore.getAll(),
      acceptAll: this.disabled(),
      addSelected: this.selected()
    });

  },

  addSelected(){
    this.state.gallery.map(value => {
      if (value.selected) {
        // console.log(value);
        galleryObjectAction.transferToInbox(value.objectGuid, value.reactId, value.categoryList);
      }
    });
  },

  selectAll(){
    this.state.gallery.map(value => {
      galleryObjectAction.update(value.reactId, {
        selected: true
      });
    });
  },

  deselectAll(){
    this.state.gallery.map(value => {
      galleryObjectAction.update(value.reactId, {
        selected: false
      });
    });
  },

  disabled(){
    if (this.state.gallery.length === 0) {
      return ' disabled';
    }
  },

  selected(){
    let selected = ' disabled';
    if (this.state.gallery.length >= 1) {
      for (let i = 0; i < this.state.gallery.length; i++) {
        if (this.state.gallery[i].selected) {
          selected = '';
        }
      }
    }
    return selected;
  },

  selectFunc(){
    if (this.state.selectButtonString === 'Select All') {
      this.setState({
        selectButtonString: 'Deselect All'
      });
      this.selectAll();
    } else {
      this.setState({
        selectButtonString: 'Select All'
      });
      this.deselectAll();
    }
  },

  render() {

    let images = this.state.gallery.map((value, key) => {
      let photoData = 'data:image/jpeg;charset=utf-8;base64,' + value.thumbnail;
      return (
        <div key={key} className="col-lg-2 col-md-3 col-sm-4 col-xs-10 noselect" style={{marginLeft: 5}}>
          <ImageDiv photoData={photoData} guid={value.objectGuid} reactId={value.reactId} data={value} selected={value.selected}/>
        </div>
      );
    });

    return (
      <div style={{marginLeft: 15, marginRight: 15}}>
        <div style={{marginLeft: '20'}}>
          <ButtonToolbar>
            <Button type='button' name='button' onClick={this.acceptAll} className={'btn btn-default' + this.state.acceptAll} style={{backgroundColor: '#3AA99E', border: '1px solid white'}}>Accept All</Button>
            <Button type='button' name='button' onClick={this.addSelected} className={'btn btn-default' + this.state.addSelected} style={{backgroundColor: '#3AA99E', border: '1px solid white'}}>Add Selected</Button>
            <Button type='button' name='button' onClick={this.selectFunc} className='btn btn-default'>{this.state.selectButtonString}</Button>
          </ButtonToolbar>
        </div>

        <hr style={{width: '94%', marginBottom: 15, marginTop: 15}}/>

        <div style={{alignContent: 'flex-start'}}>
          {images}
        </div>
      </div>
    );

  }

});

module.exports = ClientValidateView;

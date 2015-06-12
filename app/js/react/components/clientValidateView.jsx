'use strict';
var React = require('react');
var ReactGridLayout = require('react-grid-layout');
var galleryObjectAction = require('../actions/galleryObjectAction.js');
var galleryStore = require('../stores/galleryStore.js');
var ImageDiv = require('./clientValidateImageDiv.jsx');
var Button = require('react-bootstrap').Button;
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;

var getStateFromStore = function(){
  return {
    gallery: galleryStore.getAll()
  };
};

var ClientValidateView = React.createClass({
  getInitialState: function() {
    return getStateFromStore();
  },

  componentDidMount: function() {
    galleryObjectAction.getAll();
    galleryStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function(){
    galleryStore.removeChangeListener(this._onChange);
  },

  acceptAll: function(){
    console.log(this.state.gallery);
    this.state.gallery.map(function(value){
      console.log(value);
      galleryObjectAction.transferToInbox(value.objectGuid, value.reactId);
    });
  },

  generateLayout() {
    var layout = this.state.gallery.map(function(value, key){
      return {
        x: key * 2 % 12,
        y: key,
        i: key.toString(),
        w: 1,
        h: 1
      };
    });

    return layout;
  },

  _onChange: function() {
    this.setState(getStateFromStore());
    this.setState({
      layout: this.generateLayout()
    });
  },

  render: function() {
    // console.log(this.state.gallery);
    var images = this.state.gallery.map(function(value, key){
      var photoData = 'data:image/jpeg;charset=utf-8;base64,' + value.thumbnail;
      return (
        <div key={key}>
          <ImageDiv photoData={photoData} guid={value.objectGuid} reactId={value.reactId}/>
        </div>
      );
    });

    return (
      <div>
        <div style={{marginLeft: '20px'}}>
          <ButtonToolbar>
            <Button type='button' name='button' onClick={this.acceptAll} className='btn btn-default'>Accept All</Button>
          </ButtonToolbar>
        </div>

        <hr style={{width: '94%'}}/>

        <ReactGridLayout
          layout={this.state.layout}
          className='layout'
          useCSSTransforms={true}
          rowHeight={180}
          >
          {images}
        </ReactGridLayout>
      </div>
    );

  }

});

module.exports = ClientValidateView;

'use strict';
const React = require('react');
const ReactGridLayout = require('react-grid-layout');
const galleryObjectAction = require('../actions/galleryObjectAction.js');
const galleryStore = require('../stores/galleryStore.js');
const ImageDiv = require('./clientValidateImageDiv.jsx');
const Button = require('react-bootstrap').Button;
const ButtonToolbar = require('react-bootstrap').ButtonToolbar;

let getStateFromStore = () =>{
  return {
    gallery: galleryStore.getAll()
  };
};

let ClientValidateView = React.createClass({
  getInitialState() {
    return getStateFromStore();
  },

  componentDidMount() {
    galleryObjectAction.getAll();
    galleryStore.addChangeListener(this._onChange);
  },

  componentWillUnmount(){
    galleryStore.removeChangeListener(this._onChange);
  },

  acceptAll(){
    console.log(this.state.gallery);
    this.state.gallery.map((value) => {
      console.log(value);
      galleryObjectAction.transferToInbox(value.objectGuid, value.reactId);
    });
  },

  generateLayout() {
    let layout = this.state.gallery.map((value, key) => {
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

  _onChange() {
    this.setState(getStateFromStore());
    this.setState({
      layout: this.generateLayout()
    });
  },

  render() {
    // console.log(this.state.gallery);
    let images = this.state.gallery.map((value, key) => {
      let photoData = 'data:image/jpeg;charset=utf-8;base64,' + value.thumbnail;
      return (
        <div key={key}>
          <ImageDiv photoData={photoData} guid={value.objectGuid} reactId={value.reactId}/>
        </div>
      );
    });

    return (
      <div>
        <div style={{marginLeft: '20'}}>
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

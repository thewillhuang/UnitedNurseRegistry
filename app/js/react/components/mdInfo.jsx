'use strict';

const React = require('react');
// let uploaderApi = require('../webapi/uploaderApi.js');
// let manifestApi = require('../webapi/manifestApi.js');

let Mdinfo = React.createClass({

  // componentDidMount() {
  //   uploaderApi.getInboundGalleryObjectList('','','','','', function(data){
  //     console.log(data);
  //   })
  // },

  render() {
    return (
      <div className="col-md-12 bluebar">
        <div className="row">
          <div className="mdname col-md-6">Physician Name: </div>
          <div className="requestDate col-md-6 float-right">Request Date: </div>
        </div>
      </div>
    );
  }

});

module.exports = Mdinfo;

'use strict';

var React = require('react');
// var uploaderApi = require('../webapi/uploaderApi.js');
// var manifestApi = require('../webapi/manifestApi.js');

var Mdinfo = React.createClass({

  // componentDidMount: function() {
  //   uploaderApi.getInboundGalleryObjectList('','','','','', function(data){
  //     console.log(data);
  //   })
  // },

  render: function() {
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

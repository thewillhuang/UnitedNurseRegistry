// import React from 'react';
// import {TextField, RadioButton, RadioButtonGroup} from 'material-ui';
// import shiftActions from '../../actions/shiftActionCreators.js';
//
// const ShiftFilter = React.createClass({
//   componentDidMount: function () {
//     shiftActions.loadCurrent();
//   },
//
//   onAddressChange: function (e, selected) {
//     if (selected === 'currentLocation') {
//       shiftActions.loadCurrent();
//       this.refs.address.setValue('');
//     } else {
//       shiftActions.loadAddress(this.refs.address.getValue());
//     }
//   },
//
//   onPriceChange: function (e, selected) {
//     if (selected === 'BestPaying') {
//       shiftActions.sortByBestPaying();
//     } else {
//       shiftActions.sortByWorsePaying();
//     }
//   },
//
//   selectAddress: function () {
//     this.refs.searchAreaRadio.setSelectedValue('address');
//   },
//
//   loadAddress: function () {
//     shiftActions.loadAddress(this.refs.address.getValue());
//   },
//
//   render: function () {
//     return (
//       <div>
//         <RadioButtonGroup ref='searchAreaRadio' name='searchArea' onChange={this.onAddressChange} defaultSelected='currentLocation'>
//           <RadioButton
//             value='currentLocation'
//             label='Use Current Location' />
//           <RadioButton
//             value='address'
//             label='Use Address' />
//           </RadioButtonGroup>
//           <TextField
//             ref='address'
//             onFocus={this.selectAddress}
//             hintText='Enter Address or Zip'
//             onEnterKeyDown={this.loadAddress}
//             floatingLabelText='Address' />
//           <RadioButtonGroup ref='sortyByPrice' name='sortPrice' onChange={this.onPriceChange} defaultSelected='BestPaying' >
//             <RadioButton
//               value='BestPaying'
//               label='Best Paying First' />
//             <RadioButton
//               value='WorsePaying'
//               label='Best Paying Last' />
//           </RadioButtonGroup>
//       </div>
//     );
//   },
// });
//
// export default ShiftFilter;

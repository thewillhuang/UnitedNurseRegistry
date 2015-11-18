import React from 'react';
import InvoiceTable from './invoiceTable.jsx';

const Reviews = React.createClass({
  render() {
    return (
      <div className='appShift'>
        <div className='appShiftResult'>
          <div className='card'>
            <div className='cardTitle'>
              Invoice
            </div>
            <hr className='cardDivider' />
            <div className='cardBody'>
              <InvoiceTable />
            </div>
          </div>
        </div>
      </div>
    );
  },
});

export default Reviews;

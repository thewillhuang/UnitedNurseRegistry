import React from 'react';
import mui from 'material-ui';
import {Table, Column} from 'fixed-data-table';
import io from 'socket.io-client';
const ThemeManager = new mui.Styles.ThemeManager();
// const MenuItem = require('material-ui/lib/menus/menu-item');
// const MenuDivider = require('material-ui/lib/menus/menu-divider');
// import MediaQuery from 'react-responsive';
const rows = [
  ['a1', 'b1', 'c1', 'd1'],
  ['a1', 'b1', 'c1', 'd1'],
  ['a1', 'b1', 'c1', 'd1'],
  ['a1', 'b1', 'c1', 'd1'],
  // .... and more
];

function rowGetter(rowIndex) {
  return rows[rowIndex];
}

class ShiftHospitalTable extends React.Component {
  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme(),
    };
  }

  static childContextTypes = {
    muiTheme: React.PropTypes.object,
  }

  componentDidMount() {
    const socket = io.connect();
    socket.on('connect', function() {
      console.log('connected');
    });
    socket.on('shift', function(payload) {
      console.log(payload);
    });
  }

  _onRowSelection(array) {
    console.log(array);
  }

  render() {
    return (
      <div className='tableWrap'>
        <Table
          rowHeight={50}
          rowGetter={rowGetter}
          rowsCount={rows.length}
          width={700}
          height={500}
          headerHeight={50}>
          <Column
            label='Status'
            width={100}
            dataKey={0}
          />
          <Column
            label='Viewed %'
            width={100}
            dataKey={1}
          />
          <Column
            label='Price'
            width={100}
            dataKey={2}
          />
          <Column
            label='Unit'
            width={100}
            dataKey={3}
          />
        </Table>
      </div>
    );
  }
}
export default ShiftHospitalTable;

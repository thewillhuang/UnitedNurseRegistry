'use strict';

import React from 'react';
import { Home } from './components/web/home.jsx';
import { Router, Route } from 'react-router';
import { history } from 'react-router/lib/HashHistory';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

class Root extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
  }
  render() {
    return (
      <div>
        { this.props.children || <Home />}
      </div>
    );
  }
}

React.render((
  <Router history={history}>
    <Route path='/' component={Root}>
      <Route path='home' component={Home}/>

      // app route
      <Route path='app' getComponents={(cb) => {
        require.ensure([], (require) => {
          cb(null, require('./components/web/app.jsx'));
        });
      }}>
        // nested app routes
        <Route path='shifts' getComponents={(cb) => {
          require.ensure([], (require) => {
            cb(null, require('./components/app/shift.jsx'));
          });
        }}/>

        <Route path='profile' getComponents={(cb) => {
          require.ensure([], (require) => {
            cb(null, require('./components/app/profile.jsx'));
          });
        }}>

          // profile nested routes
          <Route path='profile' getComponents={(cb) => {
            require.ensure([], (require) => {
              cb(null, require('./components/app/ProfileCard.jsx'));
            });
          }} />

          <Route path='workhistory' getComponents={(cb) => {
            require.ensure([], (require) => {
              cb(null, require('./components/app/workHistoryCard.jsx'));
            });
          }} />

          <Route path='license' getComponents={(cb) => {
            require.ensure([], (require) => {
              cb(null, require('./components/app/licenseCard.jsx'));
            });
          }} />

          <Route path='specialty' getComponents={(cb) => {
            require.ensure([], (require) => {
              cb(null, require('./components/app/specialtyCard.jsx'));
            });
          }} />

          <Route path='schedule' getComponents={(cb) => {
            require.ensure([], (require) => {
              cb(null, require('./components/app/scheduleCard.jsx'));
            });
          }} />

          <Route path='security' getComponents={(cb) => {
            require.ensure([], (require) => {
              cb(null, require('./components/app/securityCard.jsx'));
            });
          }} />


        </Route>
        // end of profile nested routes

        <Route path='balance' getComponents={(cb) => {
          require.ensure([], (require) => {
            cb(null, require('./components/app/balance.jsx'));
          });
        }}/>

        <Route path='referrals' getComponents={(cb) => {
          require.ensure([], (require) => {
            cb(null, require('./components/app/referrals.jsx'));
          });
        }}/>

        <Route path='reviews' getComponents={(cb) => {
          require.ensure([], (require) => {
            cb(null, require('./components/app/reviews.jsx'));
          });
        }}/>

      </Route>

      // end of app route

      <Route path='hospitals' getComponents={(cb) => {
        require.ensure([], (require) => {
          cb(null, require('./components/web/hospital.jsx'));
        });
      }}/>

      <Route path='login' getComponents={(cb) => {
        require.ensure([], (require) => {
          cb(null, require('./components/web/login.jsx'));
        });
      }}/>

      <Route path='signup' getComponents={(cb) => {
        require.ensure([], (require) => {
          cb(null, require('./components/web/signup.jsx'));
        });
      }}/>

    </Route>
  </Router>
), document.getElementById('root'));



import React from 'react';
import Home from './components/web/home.jsx';
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
      // web routes
      <Route path='hospitalLogin' getComponents={(cb) => {
        require.ensure([], (require) => {
          cb(null, require('./components/web/hospitalLogin.jsx'));
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

      <Route path='home' getComponents={(cb) => {
        require.ensure([], (require) => {
          cb(null, require('./components/web/home.jsx'));
        });
      }} />

      // end of web routes

      // app routes
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

      // hospital route
      <Route path='hospital' getComponents={(cb) => {
        require.ensure([], (require) => {
          cb(null, require('./components/web/hospital.jsx'));
        });
      }}>
        // nested app routes
        <Route path='shifts' getComponents={(cb) => {
          require.ensure([], (require) => {
            cb(null, require('./components/hospital/shift.jsx'));
          });
        }}/>

        <Route path='profile' getComponents={(cb) => {
          require.ensure([], (require) => {
            cb(null, require('./components/hospital/profile.jsx'));
          });
        }}>

          // profile nested routes
          <Route path='profile' getComponents={(cb) => {
            require.ensure([], (require) => {
              cb(null, require('./components/hospital/ProfileCard.jsx'));
            });
          }} />

          <Route path='workhistory' getComponents={(cb) => {
            require.ensure([], (require) => {
              cb(null, require('./components/hospital/workHistoryCard.jsx'));
            });
          }} />

          <Route path='license' getComponents={(cb) => {
            require.ensure([], (require) => {
              cb(null, require('./components/hospital/licenseCard.jsx'));
            });
          }} />

          <Route path='specialty' getComponents={(cb) => {
            require.ensure([], (require) => {
              cb(null, require('./components/hospital/specialtyCard.jsx'));
            });
          }} />

          <Route path='schedule' getComponents={(cb) => {
            require.ensure([], (require) => {
              cb(null, require('./components/hospital/scheduleCard.jsx'));
            });
          }} />

          <Route path='security' getComponents={(cb) => {
            require.ensure([], (require) => {
              cb(null, require('./components/hospital/securityCard.jsx'));
            });
          }} />

        </Route>
        // end of profile nested routes

        <Route path='balance' getComponents={(cb) => {
          require.ensure([], (require) => {
            cb(null, require('./components/hospital/balance.jsx'));
          });
        }}/>

        <Route path='referrals' getComponents={(cb) => {
          require.ensure([], (require) => {
            cb(null, require('./components/hospital/referrals.jsx'));
          });
        }}/>

        <Route path='reviews' getComponents={(cb) => {
          require.ensure([], (require) => {
            cb(null, require('./components/hospital/reviews.jsx'));
          });
        }}/>

      </Route>
      // end of hospital route
    </Route>
  </Router>
), document.getElementById('root'));

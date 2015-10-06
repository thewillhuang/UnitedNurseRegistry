import React from 'react';
import Home from './components/web/home.jsx';
import { Router, Route, IndexRoute} from 'react-router';
// import { history } from 'react-router/lib/HashHistory';
// import createBrowserHistory from 'history/lib/createBrowserHistory';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

class Root extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
  }
  render() {
    return (
      <div>
        { this.props.children }
      </div>
    );
  }
}

React.render((
  <Router>
    <Route path='/' component={Root}>
      // web routes
      <IndexRoute component={Home} />

      <Route path='hospitalLogin' getComponents={(location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./components/web/hospitalLogin.jsx'));
        });
      }}/>

      <Route path='hospitalSignup' getComponents={(location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./components/web/hospitalSignup.jsx'));
        });
      }}/>

      <Route path='login' getComponents={(location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./components/web/login.jsx'));
        });
      }}/>

      <Route path='signup' getComponents={(location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./components/web/signup.jsx'));
        });
      }}/>

      <Route path='home' getComponents={(location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./components/web/home.jsx'));
        });
      }} />

      // end of web routes

      // app routes
      <Route path='app' getComponents={(location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./components/web/app.jsx'));
        });
      }}>
        // nested app routes
        <Route path='shifts' getComponents={(location, cb) => {
          require.ensure([], (require) => {
            cb(null, require('./components/app/shift.jsx'));
          });
        }}/>

        <Route path='pending' getComponents={(location, cb) => {
          require.ensure([], (require) => {
            cb(null, require('./components/app/pending.jsx'));
          });
        }}/>

        <Route path='approved' getComponents={(location, cb) => {
          require.ensure([], (require) => {
            cb(null, require('./components/app/approved.jsx'));
          });
        }}/>

        <Route path='profile' getComponents={(location, cb) => {
          require.ensure([], (require) => {
            cb(null, require('./components/app/profile.jsx'));
          });
        }}>

          // profile nested routes
          <Route path='profile' getComponents={(location, cb) => {
            require.ensure([], (require) => {
              cb(null, require('./components/app/profileCard.jsx'));
            });
          }} />

          <Route path='workhistory' getComponents={(location, cb) => {
            require.ensure([], (require) => {
              cb(null, require('./components/app/workHistoryCard.jsx'));
            });
          }} />

          <Route path='license' getComponents={(location, cb) => {
            require.ensure([], (require) => {
              cb(null, require('./components/app/licenseCard.jsx'));
            });
          }} />

          <Route path='specialty' getComponents={(location, cb) => {
            require.ensure([], (require) => {
              cb(null, require('./components/app/specialtyCard.jsx'));
            });
          }} />

          <Route path='schedule' getComponents={(location, cb) => {
            require.ensure([], (require) => {
              cb(null, require('./components/app/scheduleCard.jsx'));
            });
          }} />

          <Route path='security' getComponents={(location, cb) => {
            require.ensure([], (require) => {
              cb(null, require('./components/app/securityCard.jsx'));
            });
          }} />


        </Route>
        // end of profile nested routes

        <Route path='balance' getComponents={(location, cb) => {
          require.ensure([], (require) => {
            cb(null, require('./components/app/balance.jsx'));
          });
        }}/>

        <Route path='referrals' getComponents={(location, cb) => {
          require.ensure([], (require) => {
            cb(null, require('./components/app/referrals.jsx'));
          });
        }}/>

        <Route path='reviews' getComponents={(location, cb) => {
          require.ensure([], (require) => {
            cb(null, require('./components/app/reviews.jsx'));
          });
        }}/>

      </Route>

      // end of app route

      // hospital route
      <Route path='hospital' getComponents={(location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./components/web/hospitalApp.jsx'));
        });
      }}>
        // nested app routes
        <Route path='shifts' getComponents={(location, cb) => {
          require.ensure([], (require) => {
            cb(null, require('./components/hospital/shift.jsx'));
          });
        }}/>

        <Route path='invoice' getComponents={(location, cb) => {
          require.ensure([], (require) => {
            cb(null, require('./components/hospital/invoice.jsx'));
          });
        }}/>

        <Route path='pending' getComponents={(location, cb) => {
          require.ensure([], (require) => {
            cb(null, require('./components/hospital/pending.jsx'));
          });
        }}/>

        <Route path='approved' getComponents={(location, cb) => {
          require.ensure([], (require) => {
            cb(null, require('./components/hospital/approved.jsx'));
          });
        }}/>


        <Route path='profile' getComponents={(location, cb) => {
          require.ensure([], (require) => {
            cb(null, require('./components/hospital/profile.jsx'));
          });
        }}>

          // profile nested routes
          <Route path='profile' getComponents={(location, cb) => {
            require.ensure([], (require) => {
              cb(null, require('./components/hospital/profileCard.jsx'));
            });
          }} />

          <Route path='security' getComponents={(location, cb) => {
            require.ensure([], (require) => {
              cb(null, require('./components/hospital/securityCard.jsx'));
            });
          }} />

        </Route>
        // end of profile nested routes

        <Route path='balance' getComponents={(location, cb) => {
          require.ensure([], (require) => {
            cb(null, require('./components/hospital/balance.jsx'));
          });
        }}/>

        <Route path='referrals' getComponents={(location, cb) => {
          require.ensure([], (require) => {
            cb(null, require('./components/hospital/referrals.jsx'));
          });
        }}/>

        <Route path='reviews' getComponents={(location, cb) => {
          require.ensure([], (require) => {
            cb(null, require('./components/hospital/reviews.jsx'));
          });
        }}/>

      </Route>
      // end of hospital route
    </Route>
  </Router>
), document.getElementById('root'));

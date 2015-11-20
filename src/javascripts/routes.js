import React from 'react';
import Home from './components/web/home.jsx';
import { Route, IndexRoute } from 'react-router';

// const rootRoutes = [{
//   component: 'div',
//   childRoutes: [
//     {
//       path: '/',
//       component: require('./components/web/home.jsx'),
//       childRoutes: [
//         {
//           path: '/hospitalLogin',
//           getComponents(location, callback) {
//             require.ensure([], function(require) {
//               callback(null, require('./components/web/hospitalLogin.jsx'));
//             });
//           },
//         },
//       ],
//     },
//   ],
// }];

const routes = (
  <Route path='/' component='div'>
    // web routes
    <IndexRoute component={Home} />

    <Route path='hospitalLogin' getComponents={(location, cb) => {
      require.ensure([], (require) => {
        cb(null, require('./components/web/hospitalLogin.jsx').default);
      });
    }}/>

    <Route path='hospitalSignup' getComponents={(location, cb) => {
      require.ensure([], (require) => {
        cb(null, require('./components/web/hospitalSignup.jsx').default);
      });
    }}/>

    <Route path='login' getComponents={(location, cb) => {
      require.ensure([], (require) => {
        cb(null, require('./components/web/login.jsx').default);
      });
    }}/>

    <Route path='signup' getComponents={(location, cb) => {
      require.ensure([], (require) => {
        cb(null, require('./components/web/signup.jsx').default);
      });
    }}/>

    <Route path='home' getComponents={(location, cb) => {
      require.ensure([], (require) => {
        cb(null, require('./components/web/home.jsx').default);
      });
    }} />

    // end of web routes

    // app routes
    <Route path='app' getComponents={(location, cb) => {
      require.ensure([], (require) => {
        cb(null, require('./components/web/app.jsx').default);
      });
    }}>
      // nested app routes
      <Route path='shifts' getComponents={(location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./components/app/shift.jsx').default);
        });
      }}/>

      <Route path='pending' getComponents={(location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./components/app/pending.jsx').default);
        });
      }}/>

      <Route path='approved' getComponents={(location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./components/app/approved.jsx').default);
        });
      }}/>

      <Route path='profile' getComponents={(location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./components/app/profile.jsx').default);
        });
      }}>

        // profile nested routes
        <Route path='profile' getComponents={(location, cb) => {
          require.ensure([], (require) => {
            cb(null, require('./components/app/profileCard.jsx').default);
          });
        }} />

        <Route path='workhistory' getComponents={(location, cb) => {
          require.ensure([], (require) => {
            cb(null, require('./components/app/workHistoryCard.jsx').default);
          });
        }} />

        <Route path='license' getComponents={(location, cb) => {
          require.ensure([], (require) => {
            cb(null, require('./components/app/licenseCard.jsx').default);
          });
        }} />

        <Route path='specialty' getComponents={(location, cb) => {
          require.ensure([], (require) => {
            cb(null, require('./components/app/specialtyCard.jsx').default);
          });
        }} />

        <Route path='schedule' getComponents={(location, cb) => {
          require.ensure([], (require) => {
            cb(null, require('./components/app/scheduleCard.jsx').default);
          });
        }} />

        <Route path='security' getComponents={(location, cb) => {
          require.ensure([], (require) => {
            cb(null, require('./components/app/securityCard.jsx').default);
          });
        }} />


      </Route>
      // end of profile nested routes

      <Route path='balance' getComponents={(location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./components/app/balance.jsx').default);
        });
      }}/>

      <Route path='referrals' getComponents={(location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./components/app/referrals.jsx').default);
        });
      }}/>

      <Route path='reviews' getComponents={(location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./components/app/reviews.jsx').default);
        });
      }}/>

    </Route>

    // end of app route

    // hospital route
    <Route path='hospital' getComponents={(location, cb) => {
      require.ensure([], (require) => {
        cb(null, require('./components/web/hospitalApp.jsx').default);
      });
    }}>
      // nested app routes
      <Route path='shifts' getComponents={(location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./components/hospital/shift.jsx').default);
        });
      }}/>

      <Route path='invoice' getComponents={(location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./components/hospital/invoice.jsx').default);
        });
      }}/>

      <Route path='pending' getComponents={(location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./components/hospital/pending.jsx').default);
        });
      }}/>

      <Route path='approved' getComponents={(location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./components/hospital/approved.jsx').default);
        });
      }}/>


      <Route path='profile' getComponents={(location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./components/hospital/profile.jsx').default);
        });
      }}>

        // profile nested routes
        <Route path='profile' getComponents={(location, cb) => {
          require.ensure([], (require) => {
            cb(null, require('./components/hospital/profileCard.jsx').default);
          });
        }} />

        <Route path='security' getComponents={(location, cb) => {
          require.ensure([], (require) => {
            cb(null, require('./components/hospital/securityCard.jsx').default);
          });
        }} />

      </Route>
      // end of profile nested routes

      <Route path='balance' getComponents={(location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./components/hospital/balance.jsx').default);
        });
      }}/>

      <Route path='referrals' getComponents={(location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./components/hospital/referrals.jsx').default);
        });
      }}/>

      <Route path='reviews' getComponents={(location, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./components/hospital/reviews.jsx').default);
        });
      }}/>

    </Route>
    // end of hospital route
  </Route>
);

export default routes;

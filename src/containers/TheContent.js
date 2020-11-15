/* eslint-disable linebreak-style */
import React, { Suspense, useState, useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { CContainer, CFade } from '@coreui/react';
import ReturnLogin from '../views/modal/ReturnLogin';

// routes config
import routes from '../routes';

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse" />
  </div>
);

function TheContent() {
  // 로그인 토큰 만료 Modal 관리
  const [returnlogin, setReturnLogin] = useState(false);
  // 로그인 토큰 만료 시간 관리
  const EndTime = parseInt(localStorage.getItem('logintime')) + (localStorage.getItem('expiresIn') * 1000);
  const Userinfo = React.lazy(() => import("../views/pages/adminuser/Userinfo"));

  useEffect(() => {
    const Timer = setTimeout(() => {setReturnLogin(!returnlogin);}, EndTime - Date.now());
    return () => clearTimeout(Timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  if (localStorage.getItem('confirmuser') === 'Y') {
    routes.push({ path: "/userinfo", exact: true, name: "Userinfo", component: Userinfo })
  } 

  return (
    <main className="c-main">
      <CContainer fluid>
        <Suspense fallback={loading}>
          <Switch>
            {routes.map((route, idx) => (
              route.component && (
              <Route
                key={idx}
                path={route.path}
                exact={route.exact}
                name={route.name}
                render={(props) => {
                  if (localStorage.getItem('approve') === 'Y') {
                    return (
                      <CFade>
                        <route.component {...props} />
                      </CFade>
                    );
                  }
                  return <Redirect from="/" to="/" />;
                }}
              />
              )
            ))}
            <Redirect from="/" to="/" />
          </Switch>
        </Suspense>
      </CContainer>

      {/* 로그인 토큰 만료 Modal 구현 */}
      <ReturnLogin
        show={returnlogin}
        onClick={() => {
            setReturnLogin(false);
            localStorage.clear();
            localStorage.removeItem('token');
            window.location.reload();
        }}
      />
    </main>
  );
}

export default React.memo(TheContent);

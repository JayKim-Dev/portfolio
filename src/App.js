import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./scss/style.scss";
import IECheck from "./IECheck";
import { createGlobalStyle } from "styled-components";
import Regular from "./fonts/NotoSansKR-Regular.otf";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse" />
  </div>
);

// Containers
const TheLayout = React.lazy(() => import("./containers/TheLayout"));

// Pages
const Login = React.lazy(() => import("./views/pages/login/Login"));
const Register = React.lazy(() => import("./views/pages/register/Register"));

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'NotoSans-Regular';
    src: url(${Regular}) format('truetype');
    font-weight: 300;
    font-style: normal;
    font-display: auto;
  }
  body {
    font-family: 'NotoSans-Regular';
  }
`;

function App() {
  // 브라우저를 체크해서, IE면 IECheck 컴포넌트를 리턴한다.
  const browser = navigator.userAgent.toLowerCase();
  if (
    (navigator.appName === "Netscape" && navigator.userAgent.search("Trident") !== -1) ||
    browser.indexOf("msie") !== -1
  ) {
    return (
      <>
        <GlobalStyle />
        <IECheck />
      </>
    );
  } else {
    return (
      <>
        <GlobalStyle />
        <BrowserRouter>
          <React.Suspense fallback={loading}>
            <Switch>
              <Route exact path="/login" name="Login Page" render={(props) => <Login {...props} />} />
              <Route
                exact
                path="/register"
                name="Register Page"
                // eslint-disable-next-line react/jsx-props-no-spreading
                render={(props) => <Register {...props} />}
              />
              <Route
                path="/"
                name="Home"
                render={(props) => {
                  if (localStorage.getItem("token")) {
                    return <TheLayout {...props} />;
                  } else {
                    return <Login {...props} />;
                  }
                }}
              />
            </Switch>
          </React.Suspense>
        </BrowserRouter>
      </>
    );
  }
}

export default App;

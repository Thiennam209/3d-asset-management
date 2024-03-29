import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import AuthLayout from "layouts/auth";
import AdminLayout from "layouts/admin";
import RtlLayout from "layouts/rtl";
import { useSelector, useDispatch } from "react-redux";
import { checkAuth } from "./features/auth/authSlice";
import LoginPage from "layouts/login";
import React, { Suspense } from "react";
function App() {
  const GetToken = () => {
    const getValueJWT = useSelector((state) => state.auth.value);
    // const dispatch = useDispatch()
    if (getValueJWT === "") {
      return false;
    } else {
      // const getJWTToken = localStorage.getItem('dtvt');
      // dispatch(checkAuth(getJWTToken))
      return true;
    }
  };
  const resultCheckAuth = GetToken();
  return (
    <>
      {resultCheckAuth ? (
        <HashRouter>
          <Suspense fallback={<div>Loading...</div>}>
            <Switch>
              <Route path={`/admin`} component={AdminLayout} />
              <Route path="/admin/list-business" component={AdminLayout} />
              <Route path="/admin/list-product" component={AdminLayout} />
              <Route
                path="/admin/list-product/detail-product"
                component={AdminLayout}
              />
              {/* <Route path="/admin/list-product/product-profile" component={AdminLayout} /> */}
              <Redirect from="/" to="/admin/list-business" />
            </Switch>
          </Suspense>
        </HashRouter>
      ) : (
        <HashRouter>
          <Switch>
            <Route path={`/login`} component={LoginPage} />
            <Redirect from="*" to="/login" />
          </Switch>
        </HashRouter>
      )}
    </>
  );

  //   if (resultCheckAuth) {
  //     return (
  //       <HashRouter>
  //         <Suspense fallback={<div>Loading...</div>}>
  //           <Switch>
  //             <Route path={`/admin`} component={AdminLayout} />
  //             <Route path="/admin/list-business" component={AdminLayout} />
  //             <Route path="/admin/list-product" component={AdminLayout} />
  //             <Route
  //               path="/admin/list-product/detail-product"
  //               component={AdminLayout}
  //             />
  //             {/* <Route path="/admin/list-product/product-profile" component={AdminLayout} /> */}
  //             <Redirect from="/" to="/admin/list-business" />
  //           </Switch>
  //         </Suspense>
  //       </HashRouter>
  //     );
  //   } else {
  //     return (
  //       <HashRouter>
  //         <Switch>
  //           <Route path={`/login`} component={LoginPage} />
  //           <Redirect from="*" to="/login" />
  //         </Switch>
  //       </HashRouter>
  //     );
  //   }
}

export default App;

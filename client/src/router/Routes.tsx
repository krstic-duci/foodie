import { Route, Routes } from "react-router-dom";

import Home from "../views/Home";
import Login from "../views/Login";
import Signup from "../views/Signup";
import PrivateRoute from "./PrivateRoute";

interface AppRoutesProp {
  /**
   * True, if the user is authenticated, false otherwise.
   */
  isAuthenticated: boolean;
}

const HOME_ROUTE = "/";
const LOGIN_ROUTE = "/login";
const SIGNUP_ROUTE = "/signup";

const AppRoutes = (props: AppRoutesProp) => {
  const { isAuthenticated } = props;

  return (
    <Routes>
      {/* Unguarded Routes */}
      <Route path={LOGIN_ROUTE} Component={Login} />
      <Route path={SIGNUP_ROUTE} Component={Signup} />
      {/* Non-Authenticated Routes: accessible only if user in not authenticated */}
      {/* <Route
        element={
          <PrivateRoute
            isRouteAccessible={!isAuthenticated}
            redirectRoute={HOME_ROUTE}
          />
        }
      >
        <Route path={LOGIN_ROUTE} Component={Login} />
      </Route> */}
      {/* Authenticated Routes */}
      <Route
        element={
          <PrivateRoute
            isRouteAccessible={isAuthenticated}
            redirectRoute={LOGIN_ROUTE}
          />
        }
      >
        <Route path={HOME_ROUTE} Component={Home} />
      </Route>
      <Route path='*' element={<p>Page Not Found</p>} />
    </Routes>
  );
};

export default AppRoutes;

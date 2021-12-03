import { Switch, Route } from "react-router-dom";
import SubscriptionsListing from "./Pages/SubscriptionsListing";
import CardDetail from "./Pages/CardDetail";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import React, { useContext } from "react";
import AuthContext from "./Components/context/auth-context";
import { Redirect } from "react-router";
import UpdateCard from "./Components/UpdateCard";
import Navbar from "./Components/Navbar";

function App() {
  const authCtx = useContext(AuthContext);
  return (
    <div>
      <Navbar />

      <Switch>
        <Route path="/" exact>
          {authCtx.isLoggedIn ? (
            <SubscriptionsListing />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>

        {authCtx.isLoggedIn && [
          <Route path="/cards/update/:id" exact key="/cards/update/:id">
            <UpdateCard />
          </Route>,
          <Route path="/cards/:id" exact key="/cards/:id">
            <CardDetail />
          </Route>,
        ]}

        {!authCtx.isLoggedIn && [
          <Route path="/login" exact key={"/login"}>
            <Login />
          </Route>,
          <Route path="/register" exact key={"/register"}>
            <Register />
          </Route>,
        ]}

        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </div>
  );
}

export default App;

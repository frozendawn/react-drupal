import { Switch, Route } from "react-router-dom";
import PageLayout from "./Components/PageLayout";
import CardDetail from "./Components/CardDetail";
import Login from "./Components/Login";
import Register from "./Components/Register";
import { useContext } from "react";
import AuthContext from "./Components/context/auth-context";
import { Redirect } from "react-router";

function App() {
  const authCtx = useContext(AuthContext);
  return (
    <div>
      <Switch>
        <Route path="/" exact>
          <PageLayout />
        </Route>

        <Route path="/cards/:id" exact>
          <CardDetail />
        </Route>

        {!authCtx.isLoggedIn && (
          <Route path="/login" exact>
            <Login />
          </Route>
        )}

        {!authCtx.isLoggedIn && (
          <Route path="/register" exact>
            <Register />
          </Route>
        )}
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </div>
  );
}

export default App;

import { Switch, Route } from "react-router-dom";
import PageLayout from "./Pages/SubscriptionsListing";
import CardDetail from "./Pages/CardDetail";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { useContext } from "react";
import AuthContext from "./Components/context/auth-context";
import { Redirect } from "react-router";
import UpdateCard from './Components/UpdateCard';

function App() {
  const authCtx = useContext(AuthContext);
  console.log('logging user context:',authCtx)
  return (
    <div>
      <Switch>
        <Route path="/" exact>
          <PageLayout />
        </Route>

        <Route path="/cards/update/:id" exact>
          <UpdateCard />
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

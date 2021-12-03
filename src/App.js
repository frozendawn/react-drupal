import { Switch, Route } from "react-router-dom";
import SubscriptionsListing from "./Pages/SubscriptionsListing";
import CardDetail from "./Pages/CardDetail";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { useContext } from "react";
import AuthContext from "./Components/context/auth-context";
import { Redirect } from "react-router";
import UpdateCard from './Components/UpdateCard';
import { Typography } from "@mui/material";
import Navbar from "./Components/Navbar";
import { Grid } from "@mui/material";

function App() {
  const authCtx = useContext(AuthContext);
  return (
    <div>
      
      <Navbar />
      
      <Switch>
        <Route path="/" exact>
          {authCtx.isLoggedIn ? <SubscriptionsListing /> :
          <Grid container justifyContent="center" alignItems="center">
            <Grid item>
            <Typography>Login to view subscriptions</Typography>
          </Grid>
          </Grid>
          } 
        </Route>

        {authCtx.isLoggedIn ? (<Route path="/cards/update/:id" exact>
          <UpdateCard />
        </Route>) : null}

        {authCtx.isLoggedIn ? (<Route path="/cards/:id" exact>
          <CardDetail />
        </Route>) : null}
        

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

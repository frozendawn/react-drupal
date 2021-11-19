import { Switch, Route } from "react-router-dom";
import PageLayout from "./Components/PageLayout";
import CardDetail from "./Components/CardDetail";
import Login from './Components/Login';
import Register from "./Components/Register";

function App() {

  return (
    <div>

      <Switch>
        <Route path="/" exact>
          
            <PageLayout />
          
        </Route>

        <Route path="/cards/:id" exact>
          <CardDetail/>
        </Route>


        <Route path="/login" exact>
          <Login/>
        </Route>

        <Route path="/register" exact>
          <Register/>
        </Route>

      </Switch>
    </div>
  );
}

export default App;

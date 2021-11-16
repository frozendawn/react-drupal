import "./App.css";
import { Switch, Route } from "react-router-dom";


import PageLayout from "./Components/PageLayout";
import { Container } from "@mui/material";
import CardDetail from "./Components/CardDetail";

function App() {


  return (
    <div className="App">

      <Switch>
        <Route path="/" exact>
          <Container>
            <PageLayout />
          </Container>
        </Route>


        <Route path="/cards/:id" exact>
          <CardDetail/>
        </Route>

      </Switch>
    </div>
  );
}

export default App;

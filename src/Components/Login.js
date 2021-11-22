import { Grid, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState } from "react";
import { useContext } from "react";
import AuthContext from "./context/auth-context";
import { useHistory } from "react-router";
import Error from "./Error";

const Login = () => {
  const [formValues, setFormValues] = useState({});
  const [error, setError] = useState(null);

  const authCtx = useContext(AuthContext);

  const history = useHistory();

  const onBlurHandler = (e) => {
    setFormValues((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    fetch("http://localhost:8080/user/login?_format=json", {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({
        name: formValues.username,
        pass: formValues.password,
      }),
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": process.env.REACT_APP_CRF_TOKEN,
      },
    }).then((data) => {
      if (data.ok) {
        return data.json().then((data) => {
          authCtx.login(data.csrf_token, data.current_user);
          history.push("/");
        });
      }

      if (data.ok !== true) {
        return data.json().then((data) => {
          setError(data.message);
        });
      }
    });
  };

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "60vh" }}
      spacing={2}
    >
      <Typography variant="h6">Login</Typography>
      {error && <Error error={error} />}
      <Grid item>
        <form onSubmit={onSubmitHandler}>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Grid item>
              <TextField
                onBlur={onBlurHandler}
                id="outlined-basic"
                label="Username"
                name="username"
                variant="outlined"
              />
            </Grid>
            <Grid item>
              <TextField
                onBlur={onBlurHandler}
                id="outlined-basic"
                label="Password"
                name="password"
                type="password"
                variant="outlined"
              />
            </Grid>

            <Grid item style={{ width: "100%" }}>
              <Button fullWidth type="submit" variant="contained">
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
};

export default Login;

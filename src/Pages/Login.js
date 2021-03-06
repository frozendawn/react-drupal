import { Grid, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState } from "react";
import { useContext } from "react";
import AuthContext from "../Components/context/auth-context";
import { useHistory } from "react-router";
import Error from "../Components/Error";

const Login = () => {
  const authCtx = useContext(AuthContext);
  const history = useHistory();

  const [formValues, setFormValues] = useState({});
  const [error, setError] = useState(null);

  const onBlurHandler = (e) => {
    setFormValues((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append('grant_type', 'password');
    formData.append('client_id', '92306554-e5ba-49b2-b775-41d7208c5364');
    formData.append('client_secret', process.env.REACT_APP_OAUTH_SECRET);
    formData.append('scope', '');
    formData.append('username', formValues.username);
    formData.append('password', formValues.password);

    fetch("http://localhost:8080/oauth/token", {
      method: "POST",
      mode: "cors",
      headers: {
        'Accept': 'application/json'
      },
      body: formData
    }).then((data) => {
      const isOk = data.ok;
      return data.json().then((data) => {
        console.log('logging data for logged in user',data)
        if (isOk) {
          // Creates a date(basically in the future) by first converting the current date time to milliseconds then adds the expiration time in milliseconds.
          const expirationTime = new Date(
            new Date().getTime() + (+data.expires_in * 1000)
          );
          authCtx.login(data.access_token, formValues.username,expirationTime.toISOString());
          history.push("/");
        } else {
          setError(data.message);
        }
      });
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
                label="Username"
                name="username"
                variant="outlined"
              />
            </Grid>
            <Grid item>
              <TextField
                onBlur={onBlurHandler}
                label="Password"
                name="password"
                type="password"
                variant="outlined"
              />
            </Grid>

            <Grid item style={{ width: "100%" }}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
              >
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

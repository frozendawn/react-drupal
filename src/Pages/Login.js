import { Grid, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState } from "react";
import { useContext } from "react";
import AuthContext from "../Components/context/auth-context";
import { useHistory } from "react-router";
import { useEffect } from "react";
import Error from "../Components/Error";

const Login = () => {
  const authCtx = useContext(AuthContext);
  const history = useHistory();

  const [formValues, setFormValues] = useState({});
  const [error, setError] = useState(null);
  const [formIsValid, setFormIsValid] = useState(false);

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
        if (isOk) {
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

  useEffect(() => {
    if (
      formValues.username &&
      formValues.username.trim().length > 0 &&
      formValues.password &&
      formValues.password.trim().length > 0
    ) {
      setFormIsValid(true);
    } else {
      setFormIsValid(false);
    }
  }, [formValues.username, formValues.password]);

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
              <Button
                fullWidth
                disabled={formIsValid ? false : true}
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

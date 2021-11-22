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
      const isOk = data.ok;
      return data.json().then((data) => {
        if (isOk) {
          authCtx.login(data.csrf_token, data.current_user);
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

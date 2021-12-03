import { Grid } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Error from "../Components/Error";
import { useState } from "react";
import { useHistory } from "react-router";
import { Typography } from "@mui/material";
import { useEffect } from "react";
import validator from "validator";

const Register = () => {
  const [formValues, setFormValues] = useState({});
  const { username, password, email } = formValues;
  const [error, setError] = useState(null);
  const history = useHistory();
  const [formIsValid, setFormIsValid] = useState(false);
  useEffect(() => {
    if (
      username &&
      username.trim().length > 0 &&
      password &&
      password.trim().length > 0 &&
      email &&
      validator.isEmail(email)
    ) {
      setFormIsValid(true);
    } else {
      setFormIsValid(false);
    }
  }, [username, email, password]);

  const onBlurHandler = (e) => {
    setFormValues((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    try {
      fetch("http://localhost:8080/user/register?_format=json", {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({
          name: [formValues.username],
          mail: [formValues.email],
          pass: [formValues.password],
        }),
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": process.env.REACT_APP_CRF_TOKEN,
        },
      }).then((data) => {
        let isOk = data.ok;
        return data.json().then((data) => {
          if (isOk) {
            history.push('/');
          } else {
            setError(data.message);
          }
        });
      });
    } catch (error) {
      console.log("catch error: ", error);
    }
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
      {error && <Error error={error} />}
      <Typography variant="h6">Register</Typography>
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
                label="Username"
                name="username"
                variant="outlined"
                onBlur={onBlurHandler}
              />
            </Grid>
            <Grid item>
              <TextField
                label="Email"
                name="email"
                variant="outlined"
                onBlur={onBlurHandler}
              />
            </Grid>
            <Grid item>
              <TextField
                label="Password"
                name="password"
                type="password"
                variant="outlined"
                onBlur={onBlurHandler}
              />
            </Grid>
            <Grid item style={{ width: "100%" }}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={formIsValid ? false : true}
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

export default Register;

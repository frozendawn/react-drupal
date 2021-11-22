import { Grid } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Error from "./Error";
import { useState } from "react";
import { useHistory } from "react-router";
import { Typography } from "@mui/material";

const Register = () => {
  const [formValues, setFormValues] = useState({});
  const [error, setError] = useState(null);
  const history = useHistory();

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
        if (data.ok) {
          return data.json().then((data) => {
            history.push({
              pathname: `/`,
              state: {
                message: "Successful registration !",
              },
            });
          });
        }
        if (data.ok !== true) {
          return data.json().then((data) => {
            setError(data.message);
          });
        }
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
      <Typography variant='h6'>Register</Typography>
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
            id="outlined-basic"
            label="Username"
            name="username"
            variant="outlined"
            onBlur={onBlurHandler}
          />
          </Grid>
          <Grid item>
          <TextField
            id="outlined-basic"
            label="Email"
            name="email"
            variant="outlined"
            onBlur={onBlurHandler}
          />
          </Grid>
          <Grid item>
          <TextField
            id="outlined-basic"
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            onBlur={onBlurHandler}
          />
          </Grid>
          <Grid item style={{width: "100%"}}>
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

export default Register;

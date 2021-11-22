import { Grid } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Spinner from "./Spinner";
import Error from "./Error";

import { useEffect, useState } from "react";
import validator from "validator";

const NewCard = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formIsValid, setFormIsValid] = useState(false);
  const [error, setError] = useState(null);

  const [formFieldValues, setFormFieldValues] = useState({});
  const [invalidFields, setInvalidFields] = useState({});

  const validateEmail = (email) => {
    setInvalidFields((prevState) => {
      return {
        ...prevState,
        email: validator.isEmail(email) ? null : "email is invalid",
      };
    });
  };

  const validateRequiredField = (str, name) => {
    setInvalidFields((prevState) => {
      return {
        ...prevState,
        [name]: str.length > 0 ? null : `${name} is invalid`,
      };
    });
  };

  const setValuesOnBlurHandler = (e) => {
    setFormFieldValues((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });

    if (e.target.name === "email") {
      validateEmail(e.target.value);
    }

    if (e.target.name !== "email") {
      validateRequiredField(e.target.value, e.target.name);
    }
  };

  // set form is valid use effect
  useEffect(() => {
    const arr = Object.values(invalidFields);
    const allEqual = (arr) => arr.every((v) => v === arr[0]);
    if (allEqual(arr) && arr.length === 4) {
      setFormIsValid(true);
    } else {
      setFormIsValid(false);
    }
  }, [invalidFields]);

  //submit form handler
  const submitFormHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    fetch("http://localhost:8080/jsonapi/node/subscription", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/vnd.api+json",
        Accept: "application/vnd.api+json",
      },
      body: JSON.stringify({
        data: {
          type: "subscription",
          attributes: {
            field_first_name: formFieldValues.firstName,
            field_email: formFieldValues.email,
            title: formFieldValues.firstName,
            field_last_name: formFieldValues.lastName,
            field_description: formFieldValues.description,
          },
        },
      }),
    }).then((response) => {
      const isOk = response.ok;
      return response.json()
      .then(data => {
        if(isOk){
          if (props.currentPage === 0) {
            props.removeData();
            props.fetchData();
            props.resetTotalData();
            props.close();
          }
          props.close();
          props.resetPage();
        } else {
          setError(data.errors);
          setIsLoading(false);
        }
      })
    });
  };

  return isLoading ? (
    <Grid
      sx={{ mt: 20, mb: 20 }}
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Grid item xs={12}>
        <Spinner />
      </Grid>
    </Grid>
  ) : (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      {error &&
        error.map((err, idx) => {
          return <Error key={idx} error={err.detail} />;
        })}
      <form onSubmit={submitFormHandler}>
        <Grid item xs={12}>
          <TextField
            name="email"
            error={invalidFields.email ? true : false}
            onBlur={setValuesOnBlurHandler}
            id="standard-basic"
            label="Email"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="firstName"
            error={invalidFields.firstName ? true : false}
            onBlur={setValuesOnBlurHandler}
            id="standard-basic"
            label="First Name"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="lastName"
            error={invalidFields.lastName ? true : false}
            onBlur={setValuesOnBlurHandler}
            id="standard-basic"
            label="Last name"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="description"
            error={invalidFields.description ? true : false}
            onBlur={setValuesOnBlurHandler}
            id="standard-basic"
            label="Description"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            disabled={formIsValid ? false : true} 
            sx={{ mt: 2 }}
          >
            Submit
          </Button>
        </Grid>
      </form>
    </Grid>
  );
};

export default NewCard;

import { Grid } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Spinner from "./Spinner";
import Error from "./Error";

import { useEffect, useState } from "react";
import validator from 'validator'

const NewCard = (props) => {

  const [isLoading, setIsLoading] = useState(false);
  const [formIsValid, setFormIsValid] = useState(false);

  const [error, setError] = useState(null);

  //New Try

  const [formFieldValues, setFormFieldValues] = useState({})

  const [invalidFields, setInvalidFields] = useState({});

  const updateEmail = (email) => {

    if( email && validator.isEmail(email)){
      setInvalidFields( prevState => {
        let newState = {...prevState, email: null};
        return newState;
      })
    } else {
      if(invalidFields[email]){
        return
      } else {
        setInvalidFields(prevState => {
          let newState = {...prevState, email: 'email is invalid'};
          return newState
        });
      }
    }
  }

const checkIfInputIsEmpty = (str,name) => {
  if(str && str.length > 0){
    setInvalidFields( prevState => {
      let newState = {...prevState, [name]: null};
      return newState;
    })
  } else {
    setInvalidFields(prevState => {
      let newState = {...prevState, [name]: `${name} is invalid`};
      return newState
    });
  }
}

  const setValuesOnBlurHandler = (e) => {
    setFormFieldValues(prevState => {
      return { ...prevState, [e.target.name]: e.target.value }
    })

    if(e.target.name === 'email') {
      updateEmail(e.target.value);
    }

    if(e.target.name !== 'email') {
      checkIfInputIsEmpty(e.target.value,e.target.name)
    }
  }

// set form is valid use effect
  useEffect( () => {
   const arr = Object.values(invalidFields)
   const allEqual = arr => arr.every( v => v === arr[0] )
    if(allEqual(arr) && arr.length === 4){
      setFormIsValid(true)
    } else {
      setFormIsValid(false)
    }
  },[invalidFields])

  //submit form handler
  const submitFormHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

      try {
        const response = await fetch(
          "http://localhost:8080/jsonapi/node/subscription",
          {
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
                  field_description: formFieldValues.description
                },
              },
            })
          }
        );
        const data = await response.json();
        if(response.ok){
          if(props.currentPage === 0){
            props.removeData();
            props.fetchData();
            props.resetTotalData();
            props.close();
          }
          props.close();
          props.resetPage();
        }
        if(response.ok !== true){
          setIsLoading(false);
          setError(data.errors)
          throw new Error('Server returned response.ok !== true ',data.errors)
        }

      }
      catch (error) {
        console.log(error);
      }
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
        {error && error.map((err, idx) => {
          return (
            <Error key={idx} error={err.detail}/>
          )
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
          <Button type="submit" variant="contained" disabled={formIsValid ? false : true} sx={{ mt: 2 }}>
            Submit
          </Button>
        </Grid>
      </form>
    </Grid>
  );
};

export default NewCard;
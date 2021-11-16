import { Grid } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Spinner from "./Spinner";
import Error from "./Error";

import { useEffect, useState } from "react";
import { useRef } from "react";

const NewCard = (props) => {
  //form refs
  const emailRef = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const descriptionRef = useRef();

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState(null);

  //validation
  const [emailInput,setEmailInput] = useState('');
  const [emailIsValid,setEmailIsValid] = useState(false);
  const [emailIsTouched,setEmailIsTouched] = useState(false);

  console.log('logging emailIsTouched',emailIsTouched);

  const [firstNameInput,setFirstNameInput] = useState('');
  const [firstNameIsValid,setFirstNameIsValid] = useState(false);

  const [lastNameInput,setLastNameInput] = useState('');
  const [lastNameIsValid,setLastNameIsValid] = useState(false);

  const [descriptionInput,setDescriptionInput] = useState('');
  const [descriptionIsValid,setDescriptionIsValid] = useState(false);


  const [formIsValid,setFormIsValid] = useState(false);


  const updateEmailHandler = () => {
    setEmailInput(emailRef.current.value)
  }
  const updateFirstNameHandler = () => {
    setFirstNameInput(firstNameRef.current.value)
  }
  const updateLastNameHandler = () => {
    setLastNameInput(lastNameRef.current.value)
  }
  const updateDescriptionHandler = () => {
    setDescriptionInput(descriptionRef.current.value)
  }

 
    


  useEffect( () => {
    const checkFieldsValidity = () => {
      console.log('checking input validities')
      if(emailInput.includes('@') && emailIsTouched){
        setEmailIsValid(true);
      }
      else {
        setEmailIsValid(false);
      }
  
      if(firstNameInput.trim().length > 0 ){
        setFirstNameIsValid(true);
      }
      else {
        setFirstNameIsValid(false);
      }
  
      if(lastNameInput.trim().length > 0 ){
        setLastNameIsValid(true);
      }
      else {
        setLastNameIsValid(false);
      }
  
      if(descriptionInput.trim().length > 0){
        setDescriptionIsValid(true);
      } else {
        setDescriptionIsValid(false);
      }
    };

    

    const timeOut = setTimeout(checkFieldsValidity,200)

    return () => {
      clearTimeout(timeOut)
    }

  },[emailInput,firstNameInput,lastNameInput,descriptionInput])

  useEffect( () => {
    console.log('checking if fields are valid to enable button')
    if (emailIsValid && firstNameIsValid && lastNameIsValid & descriptionIsValid) {
      setFormIsValid(true);
    } else {
      setFormIsValid(false);
    }
  },[emailIsValid,firstNameIsValid,lastNameIsValid,descriptionIsValid])
  
  

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
                  field_first_name: firstNameRef.current.value,
                  field_email: emailRef.current.value,
                  title: firstNameRef.current.value,
                  field_last_name: lastNameRef.current.value,
                  field_description: descriptionRef.current.value,
                },
              },
            })
          }
        );
        const data = await response.json();
        console.log('logging response from server while creating new card',response);
        console.log('logging only errors',data.errors)
        console.log('logging data from response',data);
        if(response.ok){
          if(props.currentPage === 0){
            props.removeData();
            props.fetchData();
            props.resetTotalData();
            props.close();
          }

          props.resetPage();
        }
        if(response.ok !== true){
          setError(data.errors)
          setIsLoading(false);
          throw new Error('Server returned response.ok !== true')
        }

      }
      catch (error) {
        console.log(error);
      }
      finally {

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
        <Error error={error}/>
      <form onSubmit={submitFormHandler}>
        <Grid item xs={12}>
          <TextField
           error={emailIsValid && emailIsTouched ? false : true}
            onChange={updateEmailHandler}
            onBlur={ () => setEmailIsTouched(true)}
            inputRef={emailRef}
            value={emailInput}
            id="standard-basic"
            label="Email"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            error={firstNameIsValid ? false : true}
            inputRef={firstNameRef}
            onChange={updateFirstNameHandler}
            value={firstNameInput}
            id="standard-basic"
            label="First Name"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            error={lastNameIsValid ? false : true}
            inputRef={lastNameRef}
            onChange={updateLastNameHandler}
            value={lastNameInput}
            id="standard-basic"
            label="Last name"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            error={descriptionIsValid ? false : true}
            inputRef={descriptionRef}
            onChange={updateDescriptionHandler}
            value={descriptionInput}
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

import { Grid } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Spinner from "./Spinner";
import Error from "./Error";

import { useEffect, useState } from "react";

const NewCard = (props) => {

  const [isLoading, setIsLoading] = useState(false);
  const [formIsValid, setFormIsValid] = useState(false);

  const [error, setError] = useState(null);

  //New Try

  const [formFieldValues,setFormFieldValues] = useState({
    email: '',
    firstName: '',
    lastName: '',
    description: ''
  })
  console.log('logging formFieldValues',formFieldValues)

  const [invalidFields, setInvalidFields] = useState([]);
  const [isTouchedArr, setIsTouchedArr] = useState([]);
  console.log('logging isTouchedArr ',isTouchedArr);
  console.log('logging invalidFields ',invalidFields)

  const setValuesOnBlurHandler = (e) => {
    setFormFieldValues(prevState => {
      let newState;
      newState = {...prevState}
      newState[e.target.name] = e.target.value;
      return newState
    })

    console.log('logging event target name',e.target.name)
    if (isTouchedArr.includes(e.target.name)){
      return
    } else {
      setIsTouchedArr( prevState => {
        let newState = [...prevState];
        newState.push(e.target.name);
        return newState;
      })
    }

  }

  useEffect( () => {
    //check if email is valid
    if(formFieldValues.email.includes('@')){
      const foundIdx = invalidFields.findIndex( el => el === 'email')
      if(foundIdx > -1) {
        setInvalidFields( prevState => {
          let newState = [...prevState];
          newState.splice(foundIdx,1);
          return newState;
        })
      }

    } else {
      const foundIdx = invalidFields.findIndex( el => el === 'email');
      const foundItem = invalidFields[foundIdx];
      if(foundItem) {
        return;
      } else {
        setInvalidFields( prevState => {
          let newState = [...prevState];
          newState.push('email')
          return newState;
        })
      }
    }

  },[formFieldValues.email,invalidFields])

  useEffect( () => {
      //check if firstName is valid
   if(formFieldValues.firstName.trim().length > 0){
   const foundIdx = invalidFields.findIndex( el => el === 'firstName')
   if(foundIdx > -1) {
     setInvalidFields( prevState => {
       let newState = [...prevState];
       newState.splice(foundIdx,1);
       return newState;
     })
   }

 } else {
   const foundIdx = invalidFields.findIndex( el => el === 'firstName');
   const foundItem = invalidFields[foundIdx];
   if(foundItem) {
     return;
   } else {
     setInvalidFields( prevState => {
       let newState = [...prevState];
       newState.push('firstName')
       return newState;
     })
   }
 }
  
  },[formFieldValues.firstName,invalidFields])

  useEffect( () => {
  //check if lastName is valid
 if(formFieldValues.lastName.trim().length > 0){
 const foundIdx = invalidFields.findIndex( el => el === 'lastName')
 if(foundIdx > -1) {
   setInvalidFields( prevState => {
     let newState = [...prevState];
     newState.splice(foundIdx,1);
     return newState;
   })
 }

} else {
 const foundIdx = invalidFields.findIndex( el => el === 'lastName');
 const foundItem = invalidFields[foundIdx];
 if(foundItem) {
   return;
 } else {
   setInvalidFields( prevState => {
     let newState = [...prevState];
     newState.push('lastName')
     return newState;
   })
 }
}

},[formFieldValues.lastName,invalidFields])

useEffect( () => {
  //check if lastName is valid
 if(formFieldValues.description.trim().length > 0){
 const foundIdx = invalidFields.findIndex( el => el === 'description')
 if(foundIdx > -1) {
   setInvalidFields( prevState => {
     let newState = [...prevState];
     newState.splice(foundIdx,1);
     return newState;
   })
 }

} else {
 const foundIdx = invalidFields.findIndex( el => el === 'description');
 const foundItem = invalidFields[foundIdx];
 if(foundItem) {
   return;
 } else {
   setInvalidFields( prevState => {
     let newState = [...prevState];
     newState.push('description')
     return newState;
   })
 }
}

},[formFieldValues.description,invalidFields])

// set form is valid use effect
  useEffect( () => {
   if(invalidFields.length === 0){
     setFormIsValid(true);
   }else {
     setFormIsValid(false);
   }
   console.log(formIsValid);
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
            name="email"
            error={invalidFields.includes('email') && isTouchedArr.includes('email') ? true : false}
            onBlur={setValuesOnBlurHandler}
            id="standard-basic"
            label="Email"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="firstName"
            error={invalidFields.includes('firstName') && isTouchedArr.includes('firstName') ? true : false}
            onBlur={setValuesOnBlurHandler}
            id="standard-basic"
            label="First Name"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="lastName"
            error={invalidFields.includes('lastName') && isTouchedArr.includes('lastName') ? true : false}
            onBlur={setValuesOnBlurHandler}
            id="standard-basic"
            label="Last name"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="description"
            error={invalidFields.includes('description') && isTouchedArr.includes('description') ? true : false}
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
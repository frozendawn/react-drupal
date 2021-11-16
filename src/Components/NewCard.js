import { Grid } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Spinner from "./Spinner";

import { useState } from "react";
import { useRef } from "react";

const NewCard = (props) => {
  //form refs
  const emailRef = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const descriptionRef = useRef();

  const [isLoading, setIsLoading] = useState(false);

  //reset form fields function
  const resetFields = () => {
    firstNameRef.current.value = "";
    lastNameRef.current.value = "";
    emailRef.current.value = "";
    descriptionRef.current.value = "";
  };

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

        console.log('logging response from server while creating new card',response)
        if(response.ok){
          if(props.currentPage === 0){
            props.removeData();
            props.fetchData();
            props.resetTotalData();
          }

          props.resetPage();
        }
        if(response.ok !== true){
          setIsLoading(false);
          throw new Error('Server returned response.ok !== true')
        }

      }
      catch (error) {
        console.log(error);
      }
      finally {
        //resetFields();
        props.close();
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
     // sx={{ mt: 10 }}
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <form onSubmit={submitFormHandler}>
        <Grid item xs={12}>
          <TextField
            inputRef={emailRef}
            id="standard-basic"
            label="Email"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            inputRef={firstNameRef}
            id="standard-basic"
            label="First Name"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            inputRef={lastNameRef}
            id="standard-basic"
            label="Last name"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            inputRef={descriptionRef}
            id="standard-basic"
            label="Description"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Submit
          </Button>
        </Grid>
      </form>
    </Grid>
  );
};

export default NewCard;

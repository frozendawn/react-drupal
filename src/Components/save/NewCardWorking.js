import { Grid } from "@mui/material";
import { FormControl } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import { useEffect } from "react";
import { useRef } from "react";

const NewCard = (props) => {
  const emailRef = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const descriptionRef = useRef();

  const resetFields = () => {
    firstNameRef.current.value = '';
    lastNameRef.current.value = '';
    emailRef.current.value = '';
    descriptionRef.current.value = '';
  };





  const submitFormHandler = (e) => {
    e.preventDefault();

            const sendData = async () => {
              const response = await fetch('http://localhost:8080/jsonapi/node/subscription',{
                method: 'POST',
                mode: 'cors',
                headers: {
                  "Content-Type": "application/vnd.api+json",
                  "Accept": "application/vnd.api+json"
                },
                body: JSON.stringify({
                    data: {
                      type: 'subscription',
                      attributes: {
                       field_first_name: firstNameRef.current.value,
                       field_email: emailRef.current.value,
                       title: firstNameRef.current.value,
                       field_last_name: lastNameRef.current.value,
                       field_description: descriptionRef.current.value
                      }
                    }
                }),
            })
             if(response.ok){
              resetFields()
             }
            }
            sendData();

    const data = JSON.stringify({
                data: {
                  type: 'subscription',
                  attributes: {
                   field_first_name: firstNameRef.current.value,
                   field_email: emailRef.current.value,
                   title: firstNameRef.current.value,
                   field_last_name: lastNameRef.current.value,
                   field_description: descriptionRef.current.value
                  }
                }
            })

  console.log(data);
  };

  return (
    <Grid
      sx={{mt:10}}
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

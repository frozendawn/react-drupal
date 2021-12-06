import { Grid } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Spinner from "./Spinner";
import Error from "./Error";
import { useState } from "react";
import { useContext } from "react";
import AuthContext from "./context/auth-context";
import Joi from "joi"


const NewCard = ({addNew, close}) => {
  const [isLoading, setIsLoading] = useState(false);  
  const [error, setError] = useState(null);
  const authCtx = useContext(AuthContext);

  const [formFieldValues, setFormFieldValues] = useState({});
  //console.log('logging formFieldValues',formFieldValues)
  const [invalidFields, setInvalidFields] = useState({});
  //console.log('logging invalid fields', invalidFields)
  const [newlyCreatedImage, setNewlyCreatedImage] = useState(null);

  const [errors, setErrors] = useState(null);
  console.log('logging errors:', errors)


  const schema = Joi.object({
    email: Joi.string().email({ tlds: {allow: false} }).required(),
    firstName: Joi.string().min(1).max(20).required(),
    lastName: Joi.string().required(),
    description: Joi.string().min(1).max(250).required()
  });






  const handleChange = (e) => {

    //Fetch image function.

    let reader = new FileReader();

    reader.readAsArrayBuffer(e.target.files[0]);

    reader.onload = () => {
      const arrayBuffer = reader.result; // array buffer

      fetch(
        `${process.env.REACT_APP_JSONAPI_POST_PATCH}field_user_image`,
        {
          method: "POST",
          headers: {
            Accept: "application/vnd.api+json",
            "Content-Type": "application/octet-stream",
            "Content-Disposition": `file; filename="${e.target.files[0].name}"`,
            "X-CSRF-Token": process.env.REACT_APP_CRF_TOKEN,
            "X-OAuth-Authorization": `Bearer ${authCtx.token}`
          },
          body: arrayBuffer,
        }
      ).then((result) => {
        return result.json().then((data) => {
          setNewlyCreatedImage(data);
        });
      });
    };
  };

  const attachImageToSubscription = (id) => {
    fetch(
      `${process.env.REACT_APP_JSONAPI_POST_PATCH}${id}/relationships/field_user_image`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/vnd.api+json",
          "Accept": "application/vnd.api+json",
          "X-OAuth-Authorization": `Bearer ${authCtx.token}`
        },
        body: JSON.stringify({
          data: newlyCreatedImage.data,
        }),
      }
    );
  }



  const validateForm = () => {
    
    const result = schema.validate(formFieldValues,{
      abortEarly:false
    });
    console.log('logging result in schema validate', result);
    const { error } = result;
    console.log('logging error in schema validate', error);
    if (error) {
      const errorData = {};
      for (let item of error.details) {
        const name = item.path[0];
        const message = item.message;
        errorData[name] = message;
      }
      setInvalidFields(errorData);
      const convertedErrors = [];
      for(const el of result.error.details){
        convertedErrors.push(el.message);
      }
      //console.log('logging convertedErrors', convertedErrors)
      setErrors(convertedErrors);
      return false
  
    } else {
      console.log('no errors')
      setErrors(null);
      setInvalidFields({});
      return true
    }
  }

// Update formFieldValues on Blur
  const setValuesOnBlurHandler = (e) => {
    setFormFieldValues((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  //Submit form handler.
  const submitFormHandler = (e) => {
    e.preventDefault();
    const formIsValid = validateForm();
    console.log('logging result of formIsValid',formIsValid)

    if(!formIsValid){
      console.log('form didnt submit')
      return;
    }
    console.log('form did submit')
    setIsLoading(true);

    fetch(process.env.REACT_APP_JSONAPI_POST_PATCH, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/vnd.api+json",
        "Accept": "application/vnd.api+json",
        "X-CSRF-Token": process.env.REACT_APP_CRF_TOKEN,  
        "X-OAuth-Authorization": `Bearer ${authCtx.token}`
      },
      body: JSON.stringify({
        data: {
          type: "subscription",
          attributes: {
            field_email: formFieldValues.email,
            title: formFieldValues.firstName,
            field_last_name: formFieldValues.lastName,
            field_description: formFieldValues.description,
          }
        },
      }),
    }).then((response) => {
      const isOk = response.ok;
      return response.json().then((data) => {

        if(!isOk) {
          setError(data.errors);
          setIsLoading(false);
        }
        addNew();
        close();
        if(newlyCreatedImage){
          attachImageToSubscription(data.data.id)
        }
      });
    });
  };
//JSX RETURN
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
      
       {errors &&
        errors.map((err, idx) => {
          return <Error key={idx} error={err} />;
        })} 
      <form onSubmit={submitFormHandler}>
        <Grid item xs={12}>
          <TextField
            name="email"
            error={invalidFields.email ? true : false}
            onBlur={setValuesOnBlurHandler}
            label="Email"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="firstName"
            error={invalidFields.firstName ? true : false}
            onBlur={setValuesOnBlurHandler}
            label="First Name"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="lastName"
            error={invalidFields.lastName ? true : false}
            onBlur={setValuesOnBlurHandler}
            label="Last name"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="description"
            error={invalidFields.description ? true : false}
            onBlur={setValuesOnBlurHandler}
            label="Description"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" component="label" onChange={handleChange}>
            Upload File
            <input type="file" hidden name="image" />
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
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

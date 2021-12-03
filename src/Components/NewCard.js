import { Grid } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Spinner from "./Spinner";
import Error from "./Error";
import { useEffect, useState } from "react";
import validator from "validator";
import { useContext } from "react";
import AuthContext from "./context/auth-context";

const NewCard = ({addNew,close}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formIsValid, setFormIsValid] = useState(false);
  const [error, setError] = useState(null);
  const authCtx = useContext(AuthContext);

  const [formFieldValues, setFormFieldValues] = useState({});
  const [invalidFields, setInvalidFields] = useState({});

  const [newlyCreatedImage, setNewlyCreatedImage] = useState(null);

  const handleChange = (e) => {

    //image fetch function

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
  const submitFormHandler = (e) => {
    e.preventDefault();
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
        if (isOk) {
          addNew();
          close();

          let newSubscription = data;

          if(newlyCreatedImage){
            attachImageToSubscription(newSubscription.data.id)
          }
          
        } else {
          setError(data.errors);
          setIsLoading(false);
        }
      });
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
          <Button variant="contained" component="label" onChange={handleChange}>
            Upload File
            <input type="file" hidden name="image" />
          </Button>
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

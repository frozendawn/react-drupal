import { Grid } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Spinner from "./Spinner";
import Error from "./Error";
import { useState } from "react";
import { useContext } from "react";
import AuthContext from "./context/auth-context";
import Joi from "joi";

const NewCard = ({ addNew, close }) => {
  const [isLoading, setIsLoading] = useState(false);
  const authCtx = useContext(AuthContext);
  const [formFieldValues, setFormFieldValues] = useState({});
  const [invalidFields, setInvalidFields] = useState({});
  const [newlyCreatedImage, setNewlyCreatedImage] = useState(null);
  const [errors, setErrors] = useState([]);

  //isSadd() function
  const isSad = async (value) => {
    return await fetch(process.env.REACT_APP_TEXT_TO_EMOTION_API, {
      method: "POST",
      headers: {
        apikey: process.env.REACT_APP_TEXT_TO_EMOTION_API_KEY,
      },
      body: value,
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        // checking api response and returning true if sad or false if not 
        if (data.Sad > 0.49) {
          setInvalidFields({description: "Your description is too sad please redact it"});
          setErrors(["Description is too sad"])
          return true;
        }
          return false;
      })
      .catch((error) => {
        console.log("logging the error in catch", error);
      });
  };


  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    description: Joi.string().min(10).max(250).required(),
  });

  //Fetch image function.
  const uploadImageFileHandler = (e) => {
    let reader = new FileReader();

    reader.readAsArrayBuffer(e.target.files[0]);

    reader.onload = () => {
      const arrayBuffer = reader.result; // array buffer

      fetch(`${process.env.REACT_APP_JSONAPI_POST_PATCH}field_user_image`, {
        method: "POST",
        headers: {
          Accept: "application/vnd.api+json",
          "Content-Type": "application/octet-stream",
          "Content-Disposition": `file; filename="${e.target.files[0].name}"`,
          "X-CSRF-Token": process.env.REACT_APP_CRF_TOKEN,
          "X-OAuth-Authorization": `Bearer ${authCtx.token}`,
        },
        body: arrayBuffer,
      }).then((result) => {
        return result.json().then((data) => {
          setNewlyCreatedImage(data);
        });
      });
    };
  };

  //Attach image to subscription function
  const attachImageToSubscription = (id) => {
    fetch(
      `${process.env.REACT_APP_JSONAPI_POST_PATCH}${id}/relationships/field_user_image`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/vnd.api+json",
          Accept: "application/vnd.api+json",
          "X-OAuth-Authorization": `Bearer ${authCtx.token}`,
        },
        body: JSON.stringify({
          data: newlyCreatedImage.data,
        }),
      }
    );
  };

  //Validate form function, it basically validates the formFieldValues and returns true or false if the form is valid or not.
  const validateForm = async () => {
    const { error } = schema.validate(formFieldValues, { abortEarly: false });
    const { details = [] } = error || [];

    const errorData = {};
    const convertedErrors = [];

    for (let item of details) {
      errorData[item.path[0]] = item.message;
      convertedErrors.push(item.message);
    }
    setInvalidFields(errorData);
    setErrors(convertedErrors);

    if (convertedErrors.length === 0) {
      const result = await isSad(formFieldValues.description);
      return !result;
    }
    return false;
  };

  // Update formFieldValues on Blur
  const setValuesOnBlurHandler = (e) => {
    setFormFieldValues((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  //Submit form handler.
  const submitFormHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!(await validateForm())) {
      setIsLoading(false);
      return;
    }

    fetch(process.env.REACT_APP_JSONAPI_POST_PATCH, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/vnd.api+json",
        Accept: "application/vnd.api+json",
        "X-CSRF-Token": process.env.REACT_APP_CRF_TOKEN,
        "X-OAuth-Authorization": `Bearer ${authCtx.token}`,
      },
      body: JSON.stringify({
        data: {
          type: "subscription",
          attributes: {
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
      .then((data) => {
        if (!isOk) {
          const convertedErrors = [];
          for (const el of data.errors) {
            convertedErrors.push(el.detail);
          }
          setErrors(convertedErrors);
          setIsLoading(false);
          return
        }
        //if the user uploaded image attach it to the newlycreated subscription
        if (newlyCreatedImage) {
          attachImageToSubscription(data.data.id);
        }
          addNew();
          close();
      });
    });
  };
  //JSX RETURN
  return (
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
      {isLoading && <Spinner />}
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
          <Button variant="contained" component="label" onChange={uploadImageFileHandler}>
            Upload File
            <input type="file" hidden name="image" />
          </Button>
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

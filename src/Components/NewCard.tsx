import { Grid } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Spinner from "./Spinner";
import Error from "./Error";
import React, { useState } from "react";
import { useContext } from "react";
import AuthContext from "./context/auth-context";
import Joi from "joi";

interface Props {
  addNew: () => void;
  close: () => void;
}

interface FormFieldValues {
    email?: string;
    firstName?: string;
    lastName?: string;
    description?: string;
}

interface InvalidFields {
    email?: string;
    firstName?: string;
    lastName?: string;
    description?: string;
}

const NewCard: React.FC<Props> = ({ addNew, close }) => {
  const [isLoading, setIsLoading] = useState(false);
  const authCtx = useContext(AuthContext);
  const [formFieldValues, setFormFieldValues] = useState<FormFieldValues>({});
  const [invalidFields, setInvalidFields] = useState<InvalidFields>({});
  const [newlyCreatedImage, setNewlyCreatedImage] = useState(null);
  const [errors, setErrors] = useState([]);

  const isSad = async (value: string) => {
    return await fetch(process.env.REACT_APP_TEXT_TO_EMOTION_API as string, {
      method: "POST",
      headers: {
        apikey: process.env.REACT_APP_TEXT_TO_EMOTION_API_KEY as string,
      },
      body: value,
    })
      .then(data => {
        return data.json();
      })
      .then(data => {
        // Checking api response and returning true if sad or false if not.
        return data.Sad > 0.49
      })
      .catch((error) => {
        console.log("logging the error in catch", error);
      });
  };

  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),
    firstName: Joi.string()
    .required(),
    lastName: Joi.string()
    .required(),
    description: Joi.string()
    .min(10)
    .max(250)
    .required(),
  });

  //Fetch image function.
  const uploadImageFileHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    let reader = new FileReader();

    reader.readAsArrayBuffer(e.target.files[0]);

    reader.onload = () => {
      const arrayBuffer = reader.result; // array buffer

      fetch(`${process.env.REACT_APP_JSONAPI_POST_PATCH as string}field_user_image`, {
        method: "POST",
        headers: {
          Accept: "application/vnd.api+json",
          "Content-Type": "application/octet-stream",
          "Content-Disposition": `file; filename="${e.target.files[0].name}"`,
          "X-CSRF-Token": process.env.REACT_APP_CRF_TOKEN as string,
          "X-OAuth-Authorization": `Bearer ${authCtx.token}`,
        },
        body: arrayBuffer,
      }).then(result => {
        result.json()
        .then(data => {
          setNewlyCreatedImage(data);
        });
      });
    };
  };

  //Attach image to subscription function.
  const attachImageToSubscription = (id: string) => {
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
          data: newlyCreatedImage.data
        })
      }
    );
  };

  //Validate form function, it basically validates the formFieldValues and returns true or false if the form is valid or not.
  const validateForm = async () => {
    const { error }: {error: any } = schema.validate(formFieldValues, { abortEarly: false });
    console.log('logging error details structure', schema.validate(formFieldValues, { abortEarly: false }))
    const { details = [] } = error || [];

    const errorData: any = {};
    const convertedErrors = [];

    for (let item of details) {
      errorData[item.path[0]] = item.message;
      convertedErrors.push(item.message);
    }

    if (convertedErrors.length === 0) {
      let isMoodSad = await isSad(formFieldValues.description);
      if (isMoodSad) {
        errorData.description = "Your description is too sad please redact it";
        convertedErrors.push("Description is too sad");
      }
    }
    setInvalidFields(errorData);
    setErrors(convertedErrors);

    return convertedErrors.length > 0;
  };

  // Update formFieldValues on Blur
  const setValuesOnBlurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
    setFormFieldValues((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  //Submit form handler.
  const submitFormHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (await validateForm()) {
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
      .then(data => {
        if (!isOk) {
          const convertedErrors = [];
          for (const el of data.errors) {
            convertedErrors.push(el.detail);
          }
          setErrors(convertedErrors);
          setIsLoading(false);
          return;
        }
        //Only if the user has uploaded an image then I attach it to the the newlycreated subscription.
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
          <Button
            variant="contained"
            component="label"
          >
            Upload File
            <input type="file" hidden name="image" onChange={uploadImageFileHandler}/>
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
import { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import { useParams } from "react-router";
import { useHistory } from "react-router";
import Error from "./Error";
import { useContext } from "react";
import AuthContext from "./context/auth-context";

const UpdateCard = () => {
  let { id } = useParams();
  const history = useHistory();
  const authCtx = useContext(AuthContext)

  const [formFieldValues, setFormFieldValues] = useState({});
  let [error, setError] = useState(null);
  const [imgFile, setImgFile] = useState(null);
  const [imgFileBinary, setImgFileBinary] = useState(null);
  const [imgChanged, setImgChanged] = useState(false);
  // File Reader Class
  let reader = new FileReader();

  //onChange handler for image field

  const handleImageUpload = (e) => {
    setImgFile(e.target.files[0]);

    //Convert our file into Array Buffer
    reader.readAsArrayBuffer(e.target.files[0]);
    reader.onabort = () => {
      console.log("file reader aborted");
    };
    reader.onerror = () => {
      console.log("error with file reader");
    };

    reader.onload = () => {
      setImgChanged(true);
      // const arrayBuffer = reader.result; //our array buffer
      setImgFileBinary(reader.result);
    };
  };

  //update values on input change
  const setValuesOnChangeHandler = (e) => {
    setFormFieldValues((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  //fetch user data
  useEffect(() => {
    fetch(`http://localhost:8080/node/${id}?_format=json`).then((data) => {
      const isOk = data.ok;
      return data.json().then((data) => {
        console.log("logging the detail data", data);
        if (isOk) {
          setFormFieldValues({
            email: data["field_email"][0].value,
            firstName: data["title"][0].value,
            lastName: data["field_last_name"][0].value,
            description: data["field_description"][0].value,
            uuid: data["uuid"][0].value,
          });

          if (data["field_user_image"][0]) {
            setFormFieldValues((prevState) => {
              return {
                ...prevState,
                image: data["field_user_image"][0].url,
                alt: data["field_user_image"][0].alt,
              };
            });
          }
        } else {
          setError({ message: "No data found for this page" });
        }
      });
    });
  }, [id]);

  //update user data

  //submit form handler
  const submitFormHandler = (e) => {
    e.preventDefault();

    fetch(
      `http://localhost:8080/jsonapi/node/subscription/${formFieldValues.uuid}`,
      {
        method: "PATCH",
        mode: "cors",
        headers: {
          "Accept": "application/vnd.api+json",
          "Content-Type": "application/vnd.api+json",
          "X-CSRF-Token": process.env.REACT_APP_CRF_TOKEN,
          "X-OAuth-Authorization": `Bearer ${authCtx.token}`
        },
        body: JSON.stringify({
          data: {
            type: "subscription",
            id: formFieldValues.uuid,
            attributes: {
              field_email: formFieldValues.email,
              title: formFieldValues.firstName,
              field_last_name: formFieldValues.lastName,
              field_description: formFieldValues.description,
            },
          },
        }),
      }
    ).then((response) => {
      console.log('logging response in FIRST THEN',response)
      const isOk = response.ok;
      return response.json().then((data) => {
        if (isOk) {

          if (imgChanged) {
            //posting image if the rest of the data is updated successfully
            //upload image
            fetch(
              `http://localhost:8080/jsonapi/node/subscription/${formFieldValues.uuid}/field_user_image`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/octet-stream",
                  "Accept": "application/vnd.api+json",
                  "Content-Disposition": `file; filename="${imgFile.name}"`,
                },
                body: imgFileBinary,
              }
            ).finally(() => {
              history.replace(`/cards/${id}`);
            });
          } else {
            history.replace(`/cards/${id}`);
          }
        } else {
          console.log("logging data in response not ok", data);
          console.log("response is not ok");
          setError(data.errors[0].detail)
        }
      });
    });
  };

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      {error ? <Error error={error} /> : null}
      <form onSubmit={submitFormHandler}>
        <Grid item xs={12}>
          <TextField
            name="email"
            value={formFieldValues.email || ""}
            onChange={setValuesOnChangeHandler}
            id="standard-basic"
            label="Email"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="firstName"
            value={formFieldValues.firstName || ""}
            onChange={setValuesOnChangeHandler}
            id="standard-basic"
            label="First Name"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="lastName"
            value={formFieldValues.lastName || ""}
            onChange={setValuesOnChangeHandler}
            id="standard-basic"
            label="Last name"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="description"
            value={formFieldValues.description || ""}
            onChange={setValuesOnChangeHandler}
            id="standard-basic"
            label="Description"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" component="label">
            Upload File
            <input
              type="file"
              hidden
              name="image"
              onChange={handleImageUpload}
            />
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

export default UpdateCard;

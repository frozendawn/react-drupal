import React from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { Typography } from "@mui/material";

const Error = ({error}) => {
  return (
    <Alert severity="error">
      <AlertTitle>Error</AlertTitle>
      <Typography variant="p">
        {error}
      </Typography>
    </Alert>
  );
};

export default Error;

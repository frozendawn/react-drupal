import React from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { Typography } from "@mui/material";

const Error: React.FC<{error: string}> = ({error}) => {
  return (
    <Alert severity="error">
      <AlertTitle>Error</AlertTitle>
      <Typography variant="body1">
        {error}
      </Typography>
    </Alert>
  );
};

export default Error;

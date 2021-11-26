import { useHistory } from "react-router";
import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from "@mui/material";

const SingleCard = ({id,created,firstName,lastName}) => {
  let history = useHistory();

  const clickHandler = (e) => {
    history.push(`/cards/${id}`);
  };

  const editHandler = (e) => {
    history.push(`/cards/update/${id}`)
  }

  const card = (
    <React.Fragment>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {created}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {firstName} {lastName}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={clickHandler}>
          Learn More
        </Button>
        <IconButton onClick={editHandler}>
          <EditIcon/>
        </IconButton>
      </CardActions>
    </React.Fragment>
  );

  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">{card}</Card>
    </Box>
  );
};

export default SingleCard;

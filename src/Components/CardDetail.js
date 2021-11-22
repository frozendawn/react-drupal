import { useState } from "react";
import { useLocation } from "react-router-dom";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";

const CardDetail = () => {
  let location = useLocation();
  const [foundCard, setFoundCard] = useState(location.state)
  return (
    foundCard ? <Grid container justifyContent="center" alignItems="center">
    <Card sx={{ maxWidth: 345 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {foundCard.firstName} {foundCard.lastName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {foundCard.description}
        </Typography>
      </CardContent>
    </Card>
  </Grid> : <Typography gutterBottom variant="p">Card not found. Please check the way you came to this page.</Typography>
  );
};

export default CardDetail;

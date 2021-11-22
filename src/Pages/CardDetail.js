import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
import { useParams } from "react-router";
import Spinner from "../Components/Spinner";

const CardDetail = () => {
  const [isLoading, setIsLoading] = useState(true);
  let { id } = useParams();
  const [foundCard, setFoundCard] = useState({});
  let { firstName, lastName, description } = foundCard;
  let [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetch(`http://localhost:8080/node/${id}?_format=json`).then((data) => {
      const isOk = data.ok;
      return data.json().then((data) => {
        setIsLoading(false);
        if (isOk) {
          setFoundCard({
            firstName: data["title"][0].value,
            lastName: data["field_last_name"][0].value,
            description: data["field_description"][0].value
          });
        } else {
          setError({ message: "No data found for this page" });
        }
      });
    });
  }, [id]);

  return isLoading ? (
    <Grid container justifyContent="center" alignItems="center">
      <Spinner />
    </Grid>
  ) : (
    <Grid container justifyContent="center" alignItems="center">
      <Card sx={{ maxWidth: 345 }}>
        {error ? (
          <CardContent>
            <Typography>{error.message}</Typography>
          </CardContent>
        ) : (
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {firstName} {lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </CardContent>
        )}
      </Card>
    </Grid>
  );
};

export default CardDetail;

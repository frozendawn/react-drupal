import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
import { useParams } from "react-router";
import Spinner from "../Components/Spinner";
import { CardMedia } from "@mui/material";

interface FoundCard {
  firstName: string;
  lastName: string;
  description: string;
  image: string;
  alt: string;
}

const CardDetail = () => {
  const [isLoading, setIsLoading] = useState(true);
  let { id }: {id: string} = useParams();
  const [foundCard, setFoundCard] = useState<Partial<FoundCard>>({});
  let { firstName, lastName, description, image, alt} = foundCard;
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
          if(data["field_user_image"][0]){
            setFoundCard(prevState => {
              return {
                ...prevState,
                image: data["field_user_image"][0].url,
                alt: data["field_user_image"][0].alt,
              }
            })
          }
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
        {foundCard.image ? (
          <CardMedia
            component="img"
            height="300"
            image={image}
            alt={alt}
          />
        ) : null}
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

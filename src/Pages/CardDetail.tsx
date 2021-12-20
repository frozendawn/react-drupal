import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActions, Grid } from "@mui/material";
import { useParams } from "react-router";
import Spinner from "../Components/Spinner";
import { CardMedia } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { IconButton } from "@mui/material";
import { useContext } from 'react';
import AuthContext from '../Components/context/auth-context';

interface FoundCard {
  firstName: string;
  lastName: string;
  description: string;
  uuid: string;
  image: string;
  alt: string;
}

const CardDetail = () => {
  const [isLoading, setIsLoading] = useState(true);
  let { id }: {id: string} = useParams();
  const [foundCard, setFoundCard] = useState<Partial<FoundCard>>({});
  let { firstName, lastName, description, image, alt, uuid,} = foundCard;
  let [error, setError] = useState(null);
  let authCtx = useContext(AuthContext);

  const createSubscription = () => {
    fetch(`http://localhost:8080/jsonapi/node/user_subscription/`,{
      method: "POST",
      headers: {
        "Content-Type": "application/vnd.api+json",
        Accept: "application/vnd.api+json",
        "X-OAuth-Authorization": `Bearer ${authCtx.token}`,
      },
      body: JSON.stringify({
        data: {
            type: "node--user_subscription",
            attributes: {
              title: "Subscription to Subscription",
            },
            relationships: {
              field_subscription: {
                data: {
                  type: "node--subscription",
                  id: uuid
                }
              }
            }
          }
      })
    }).then(response => {
      console.log('logging response',response);
      return response.json()
    }).then(data => {
      console.log('logging data in second then',data)
    })
  }

  useEffect(() => {
    setIsLoading(true);
    fetch(`http://localhost:8080/node/${id}?_format=json`).then((data) => {
      const isOk = data.ok;
      return data.json().then((data) => {
        console.log('subscription data',data)
        setIsLoading(false);
        if (isOk) {
          setFoundCard({
            firstName: data["title"][0].value,
            lastName: data["field_last_name"][0].value,
            description: data["field_description"][0].value,
            uuid: data["uuid"][0].value
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
        <CardActions>
              <IconButton onClick={createSubscription}>
                <AddIcon/>
              </IconButton>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default CardDetail;

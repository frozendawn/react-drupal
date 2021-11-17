import { useEffect } from 'react';
import { useParams } from 'react-router';
import { useState } from 'react';



import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Grid } from "@mui/material";





const CardDetail = () => {

    let params = useParams();
    const id = params.id;
    console.log(params);
    console.log(id);

    const [foundCard,setFoundCard] = useState({});
    
    useEffect( () => {
        const fetchBlog = async () => {
            const response = await fetch(`http://localhost:8080/node/${id}?_format=json`);
            const data = await response.json();
            console.log(response);
            console.log(data);


            let formatedCard = {};
            

            formatedCard = {
                firstName: data['title'][0].value,
                lastName: data['field_last_name'][0].value,
                description: data['field_description'][0].value
            }
            console.log('formatedcard',formatedCard);

            setFoundCard(formatedCard);







        }

        fetchBlog();
    },[id])









    return (
        <Grid container justifyContent="center" alignItems="center" >
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
      </Grid>
    )
}

export default CardDetail;
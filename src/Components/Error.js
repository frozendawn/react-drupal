import React, { useEffect } from 'react';
import { useState } from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { Typography } from "@mui/material";


const Error = (props) => {

    const [error,setError] = useState([]);


    const transformError = async () => {
        const updatedError = []
         for(let key in props.error){
            if(props.error[key].detail.includes('first')){
                updatedError.push('First name is invalid')
            }
    
            if(props.error[key].detail.includes('email')){
                updatedError.push('Invalid email')
            }
    
            if(props.error[key].detail.includes('description')){
                updatedError.push('Invalid description')
            }
    
            if(props.error[key].detail.includes('last')){
                updatedError.push('Invalid last name')
            }
            console.log('loggin updatedError',updatedError)
        }
        setError(updatedError);
    }

    useEffect( () => {
        transformError();
    },[props.error])

    return (
      props.error ? 
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
         {error.map((err,idx) => {
             return (
             <Typography variant="p" key={idx}>
              {err}
             </Typography>
    )
}) }
      </Alert> : null
    )
}

export default Error;
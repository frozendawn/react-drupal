import { Button } from "@mui/material";
import { useEffect, useState } from "react";

const MagicalButton = (props) => {
  const [nextPageData, setNextPageData] = useState([]);

  useEffect(() => {
    const fetchNextPage = async () => {
      const response = await fetch(
        `http://localhost:8080/api/subscription/?page=${props.currentPage + 1}`
      );
      const data = await response.json();
      setNextPageData(data);
    };

    fetchNextPage();
  }, [props.currentPage]);

  let buttonValue;



  if (nextPageData.slice().length < 6) {
    
    buttonValue = `Load ${nextPageData.length} more of ${props.remaining} remaining`;

    if (props.remaining < props.fetchLimit){
      buttonValue = `Load ${props.remaining} more`;
    }

    if(nextPageData.slice().length === 0){
        buttonValue = "Nothing left";
    }
  } else if (nextPageData.length === 6) {
    buttonValue = "Load more";
  } 


  const loadButton =
    nextPageData.slice().length > 0 ? (
      <Button variant="outlined" onClick={props.onClickHandler} margin="normal" sx={{ mt: 3 }}>
        {buttonValue}
      </Button>
    ) : (
      <Button variant="outlined" disabled margin="normal" sx={{ mt: 3 }}>
        {buttonValue}
      </Button>
    );

  return loadButton;
};

export default MagicalButton;

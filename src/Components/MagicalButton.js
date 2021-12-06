import { Button } from "@mui/material";
import { useEffect, useState } from "react";

const MagicalButton = ({currentPage, fetchLimit, remaining, onClickHandler}) => {
  const [nextPageData, setNextPageData] = useState([]);

  useEffect(() => {
    const fetchNextPage = async () => {
      const response = await fetch(
        `http://localhost:8080/api/subscription/?page=${currentPage + 1}`
      );
      const data = await response.json();
      setNextPageData(data);
    };

    fetchNextPage();
  }, [currentPage]);

  let buttonValue;

  if (nextPageData.slice().length < 6) {
    
    buttonValue = `Load ${nextPageData.length} more of ${remaining} remaining`;

    if (remaining < fetchLimit){
      buttonValue = `Load ${remaining} more`;
    }

    if(nextPageData.slice().length === 0){
        buttonValue = "Nothing left";
    }
  } else if (nextPageData.length === 6) {
    buttonValue = "Load more";
  } 


  const loadButton =
    nextPageData.slice().length > 0 ? (
      <Button variant="outlined" onClick={onClickHandler} margin="normal" sx={{ mt: 3 }}>
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

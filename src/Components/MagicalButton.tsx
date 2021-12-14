import { Button } from "@mui/material";
import { useEffect, useState } from "react";

interface Props {
  currentPage: number;
  fetchLimit: number;
  remaining: number;
  onClickHandler: () => void;
}

const MagicalButton: React.FC<Props> = ({currentPage, fetchLimit, remaining, onClickHandler}) => {
  const [nextPageDataLength, setNextPageDataLength] = useState(0);

  useEffect(() => {
    const fetchNextPage = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_DOMAIN}api/subscription/?page=${currentPage + 1}`
      );
      const data = await response.json();
      setNextPageDataLength(data.length);
    };

    fetchNextPage();
  }, [currentPage]);

  let buttonValue;

    buttonValue = `Load ${nextPageDataLength} more of ${remaining} remaining`
    if(fetchLimit > remaining) {
      buttonValue = `Load ${remaining} more`
    }

  const loadButton =
  nextPageDataLength > 0 ? (
      <Button variant="outlined" onClick={onClickHandler} sx={{ mt: 3 }}>
        {buttonValue}
      </Button>
    ) : null

  return loadButton;
};

export default MagicalButton;

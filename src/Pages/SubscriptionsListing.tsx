import { useCallback, useEffect, useState } from "react";
import React from "react";
import { Grid } from "@mui/material";
import SingleCard from "../Components/SingleCard";
import { Button } from "@mui/material";
import MagicalButton from "../Components/MagicalButton";
import NewCard from "../Components/NewCard";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Container } from "@mui/material";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface ConvertedData {
  id: string;
  author: string;
  created: string;
  firstName: string;
  lastName: string;
  description: string;
}

const SubscriptionsListing = () => {
  const [curPage, setCurPage] = useState(0);
  const [storedData, setStoredData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const fetchLimit = 3;

  const [open, setOpen] = useState(false);
  // Function which fetches data received from drupal for the current page.
  const fetchData = useCallback(() => {
    fetch(`${process.env.REACT_APP_API_URL}?page=${curPage}`)
      .then((data) => data.json())
      .then((data) => {
        const convertedData: Array<ConvertedData> = [];

        for (let key in data) {
          let dataKey = data[key];
          convertedData.push({
            id: dataKey.nid,
            author: dataKey.uid,
            created: dataKey.created,
            firstName: dataKey.title,
            lastName: dataKey.field_last_name,
            description: dataKey.field_description,
          });
        }

        setStoredData((prevState) => {
          let updatedArray = [...prevState, ...convertedData];
          return updatedArray;
        });
      });
  }, [curPage]);

  // Function which fetches the length of the total amount of data stored in drupal.

  const fetchTotalDataValue = () => {
    fetch(process.env.REACT_APP_API_FETCH_TOTAL_DATA)
      .then((data) => data.json())
      .then((data) => setTotalData(data.total));
  };

  const loadMoreHandler = () => {
    setCurPage((prevState) => ++prevState);
  };

  // Set the total data amount for the fist time the page renders.
  useEffect(() => {
    fetchTotalDataValue();
  }, []);

  //Fetch data for current page.
  useEffect(() => {
    fetchData();
  }, [curPage, fetchData]);

  const newlyAddedSubscription = () => {
    if (curPage !== 0) {
      setCurPage(0);
    }

    if (curPage === 0) {
      fetchData();
    }
    setStoredData([]);
    fetchTotalDataValue();
  };

  return (
    <div>
      <Container>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          spacing={3}
          sx={{ mt: 5 }}
        >
          <Grid container spacing={3}>
            {storedData.map((el) => {
              return (
                <Grid item lg={4} key={el.id}>
                  <SingleCard
                    firstName={el.firstName}
                    lastName={el.lastName}
                    id={el.id}
                    created={el.created}
                    author={el.author}
                  />
                </Grid>
              );
            })}
          </Grid>

          <Grid container justifyContent="center" alignItems="center">
            <Grid item>
              <MagicalButton
                onClickHandler={loadMoreHandler}
                currentPage={curPage}
                remaining={totalData - storedData.length}
                fetchLimit={fetchLimit}
              />
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                onClick={() => setOpen(true)}
                sx={{ mt: 3, ml: 3 }}
              >
                Add new
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <NewCard
              addNew={newlyAddedSubscription}
              close={() => setOpen(false)}
            />
          </Box>
        </Modal>
      </Container>
    </div>
  );
};

export default SubscriptionsListing;

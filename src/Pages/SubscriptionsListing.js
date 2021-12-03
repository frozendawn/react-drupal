import { useEffect, useState } from "react";
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
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const SubscriptionsListing = () => {
  const [curPage, setCurPage] = useState(0);
  const [storedData, setStoredData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const fetchLimit = 3;
  const [remaining, setRemaining] = useState(0);

  const [open, setOpen] = useState(false);
  // fetchData function
  const fetchData = () => {
    fetch(`${process.env.REACT_APP_API_URL}?page=${curPage}`)
      .then((data) => data.json())
      .then((data) => {
        const convertedData = [];

        for (let key in data) {
          let dataKey = data[key];
          convertedData.push({
            id: dataKey.nid,
            author: dataKey.uid,
            created: dataKey.created,
            firstName: dataKey.title,
            lastName: dataKey.field_last_name,
            description: dataKey.field_description
          });
        }

        setStoredData((prevState) => {
          let updatedArray = [...prevState, ...convertedData];
          return updatedArray;
        });
      });
  };

  // fetch total amount of data function

  const fetchTotalDataValue = () => {
    fetch(process.env.REACT_APP_API_FETCH_TOTAL_DATA)
      .then((data) => data.json())
      .then((data) => setTotalData(data.total));
  };

  useEffect(() => {
    setRemaining(totalData - fetchLimit);
  }, [totalData]);

  const loadMoreHandler = () => {
    setRemaining((prevState) => {
      let updatedRemaining = prevState - fetchLimit;

      if (updatedRemaining <= 0) {
        updatedRemaining = 0;
      }

      return updatedRemaining;
    });

    setCurPage(prevState => prevState + 1);
    // prevState++ ne raboti
  };

  // Fetch total number of data for the first time the page renders
  useEffect(() => {
    fetchTotalDataValue();
  }, []);

  //fetch data for current page
  useEffect(() => {
  fetchData();
  }, [curPage]);


 const newlyAddedSubscription = () => {
   if(curPage !== 0 ){
    setCurPage(0);
   }

   if(curPage === 0) {
     fetchData();
   }
   setStoredData([]);
   fetchTotalDataValue();
 }

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
                    description={el.description}
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
                remaining={remaining}
                fetchLimit={fetchLimit}
              />
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                onClick={() => setOpen(true)}
                margin="normal"
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

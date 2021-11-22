import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import React from "react";
import { Grid } from "@mui/material";
import SingleCard from "./SingleCard";
import { Button } from "@mui/material";
import MagicalButton from "./MagicalButton";
import NewCard from "./NewCard";

import Box from "@mui/material/Box";
import Alert from '@mui/material/Alert';
import Modal from "@mui/material/Modal";
import Navbar from "./Navbar";
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

const PageLayout = () => {
  const [curPage, setCurPage] = useState(0);
  const [storedData, setStoredData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const fetchLimit = 3;
  const [remaining, setRemaining] = useState(0);
  let url = "http://localhost:8080/api/subscription";

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  const location = useLocation();
  
  // fetchData function
  const fetchData = () => {
     fetch(`${url}?page=${curPage}`)
     .then( data => data.json() )
     .then( data => {
      const convertedData = [];

      for (let key in data) {
        convertedData.push({
          id: data[key].nid,
          created: data[key].created,
          firstName: data[key].title,
          lastName: data[key].field_last_name,
          description: data[key].field_description,
        });
      }
  
      setStoredData((prevState) => {
        let updatedArray = [...prevState, ...convertedData];
        return updatedArray;
      });
     })

  };

  // fetch total amount of data function

  const fetchDataValue = () => {
     fetch("http://localhost:8080/api/total_data")
    .then(data => data.json())
    .then(data => setTotalData(data.total))
  };

  useEffect(() => {
    setRemaining(totalData - fetchLimit);
  }, [totalData]);

  const resetPageHandler = () => {
    setCurPage(0);
  };

  const deleteDataHandler = (e) => {
    setStoredData([]);
  };

  const loadMoreHandler = (e) => {
    setRemaining((prevState) => {
      let updatedRemaining = prevState - fetchLimit;

      if (updatedRemaining <= 0) {
        updatedRemaining = 0;
      }

      return updatedRemaining;
    });

    setCurPage((prevState) => {
      return prevState + 1;
    });
  };

  // Fetch total number of data
  useEffect(() => {
    fetchDataValue();
  }, [curPage]);

  //fetch data for current page
  useEffect(() => {
    
    if(curPage === 0){
      setStoredData([]);
      fetchData();
    }
    else if (curPage > 0) {
      fetchData();
    }

  }, [curPage]);

  return (
    <div>
      <Navbar/>
      <Container>
      <Grid container justifyContent="center" alignItems="center" spacing={3} sx={{mt:5}}>

      {location.state && location.state.message ? <Alert severity="success">{location.state.message}</Alert> : null}





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
              onClick={handleOpen}
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
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <NewCard
            currentPage={curPage}
            resetPage={resetPageHandler}
            removeData={deleteDataHandler}
            fetchData={fetchData}
            resetTotalData={fetchDataValue}
            close={handleClose}
          />
        </Box>
      </Modal>
      </Container>
    </div>
  );
};

export default PageLayout;
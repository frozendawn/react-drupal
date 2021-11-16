import { useEffect, useState } from "react";
import React from "react";
import { Grid } from "@mui/material";
import SingleCard from "./SingleCard";
import { Button } from "@mui/material";
import MagicalButton from "./MagicalButton";
import NewCard from "./NewCard";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

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
  const [data, setData] = useState([]);
  const [storedData, setStoredData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const fetchLimit = 3;
  const [remaining, setRemaining] = useState(0);
  let url = "http://localhost:8080/api/subscription";
  console.log("storedData ", storedData);
  console.log("currentpage: ", curPage);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // fetchData function

  const fetchData = async () => {
    let response;

    response = await fetch(`${url}?page=${curPage}`);

    const data = await response.json();
    //console.log("fetched Data for a page", data);
    if (data.length === 0) {
      setData([]);
      return;
    }
    //console.log("logging data", data);

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

    //console.log("logging converted data", convertedData);
    setData(convertedData);

    setStoredData((prevState) => {
      let updatedArray = [...prevState, ...convertedData];
      return updatedArray;
    });
  };

  // fetch total amount of data function

  const fetchDataValue = async () => {
    const response = await fetch("http://localhost:8080/api/total_data");
    const data = await response.json();
    setTotalData(data.total);
  };

  useEffect(() => {
    setRemaining(totalData - fetchLimit);
  }, [totalData]);

  const resetPageHandler = () => {
    setCurPage(0);
  };

  const deleteDataHandler = (e) => {
    setData([]);
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
    console.log("useEffect ran in total number of data");
    fetchDataValue();
  }, [curPage]);

  //fetch data for current page
  useEffect(() => {
    
    if(curPage === 0){
      setStoredData([]);
      fetchData();
    }
    else if (curPage > 0) {
      setData([]);
      fetchData();
    }

  }, [curPage]);

  return (
    <div>
      <Grid container justifyContent="center" alignItems="center" spacing={3} sx={{mt:5}}>

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
              data={data}
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
    </div>
  );
};

export default PageLayout;
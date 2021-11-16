import { useEffect, useState } from "react";

import { Grid } from "@mui/material";
import SingleCard from "./SingleCard";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Button } from "@mui/material";

const PageLayout = () => {
  const [curPage, setCurPage] = useState(1);
  const [data, setData] = useState([]);
  const [storedData, setStoredData] = useState([]);

  console.log('logging storedData ',storedData);

 /*  let paginationSettings = (data, itemsPerPage) => {
    return {
      data: data,
      itemsPerPage: itemsPerPage,
      numberOfPages: Math.ceil(data.length / itemsPerPage),
    };
  }; */

  //let paginationn = paginationSettings(data, 3);
  //console.log('logging paginationn settings', paginationn);

  const handleChange = (event, value) => {
    setCurPage(value);
  };

  const loadMoreHandler = (e) => {
    setCurPage((prevState) => {
      return prevState + 1;
    });
  };

  let buttonValue = data.slice().length <= 0 ? "Nothing left" : "Load more";
  //let buttonDisabled = data.slice().length <= 0 ? disabled : null;

  const loadButton =
    data.slice().length > 0 ? (
      <Button variant="outlined" onClick={loadMoreHandler}>
        {buttonValue}
      </Button>
    ) : (
      <Button variant="outlined" disabled onClick={loadMoreHandler}>
        {buttonValue}
      </Button>
    );

  let url = "http://localhost:8080/api/subscription";

  useEffect(() => {
    const fetchData = async () => {
      let response;

      /*       if(curPage>1){
        response = await fetch(`${url}?page=${curPage -1}`);
      } else {
        response = await fetch(`${url}`);
      } */

      response = await fetch(`${url}?page=${curPage - 1}`);

      const data = await response.json();
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
        console.log("logging prevState", prevState);
        let updatedArray = [
          ...prevState,
          ...convertedData
        ]
        return updatedArray;
      });
    };
    fetchData();
  }, [curPage, url]);

  return (
    <Grid container spacing={3}>
      {data.map((el) => {
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
      <Grid container justifyContent="center" alignItems="center">
        <Grid item>{loadButton}</Grid>
      </Grid>
      {/* {loadButton} */}
      {/* <Button variant="outlined"  onClick={loadMoreHandler}>{buttonValue}</Button> */}

      <Grid container justifyContent="center" alignItems="center">
        <Grid item>
          <Stack spacing={2}>
            <Pagination page={curPage} count={3} onChange={handleChange} />
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PageLayout;





let buttonValue = (
    if(data.slice().length <= 0){
        return 'Nothing left';
    }
    else if (data.slice().length < 6){
        return `Load ${data.slice.length} more`;
    }
    else {
        return 'Load more';
    }
    
)






const loadButton =
    data.slice().length > 0 ? (
      <Button variant="outlined" onClick={loadMoreHandler}>
        {buttonValue}
      </Button>
    ) : (
      <Button variant="outlined" disabled onClick={loadMoreHandler}>
        {buttonValue}
      </Button>
    );
import { useEffect, useState } from "react";
import { useHistory } from "react-router";

import { Grid } from "@mui/material";
import SingleCard from "./SingleCard";
import { Button } from "@mui/material";
import MagicalButton from "./MagicalButton";
import NewCard from "./NewCard";

const PageLayout = () => {
  const [curPage, setCurPage] = useState(1);
  const [data, setData] = useState([]);
  const [storedData, setStoredData] = useState([]);
  const [totalData,setTotalData] = useState(0);
  const fetchLimit = 3;
  const [remaining,setRemaining] = useState(0);
  const [formShowing,setFormShowing] = useState(false); 

  const history = useHistory();

  console.log('logging storedData ',storedData);

/*   const pushNewlyCreatedDataHandler = (data) => {
    console.log(storedData)
    setStoredData(prevState => {
      const newData = [
        data,
        ...prevState
      ]
      console.log(newData)
      console.log(storedData)
      return newData
    })
  } */


  const deleteDataHandler = (e) => {
    setStoredData([]);
  }

  const addNewHandler = (e) => {
    setFormShowing(prevState => !prevState)
  }

/*   const handleChange = (event, value) => {
    setCurPage(value);
  }; */

  const loadMoreHandler = (e) => {
    setRemaining( (prevState) => {
      let updatedRemaining = prevState - fetchLimit;

      if (updatedRemaining <= 0) {
        updatedRemaining = 0;
      }

      return updatedRemaining;
    }
    )


    setCurPage((prevState) => {
      return prevState + 1;
    });
  };
// Fetch total number of data
    useEffect( () => {
      const fetchDataValue = async () => {
        const response = await fetch('http://localhost:8080/api/total_data');
        const data = await response.json();
        setTotalData(data.total)
        setRemaining(data.total - fetchLimit)
        console.log('fetch total data useEffect');
      }
      fetchDataValue();
    },[curPage])



  let url = "http://localhost:8080/api/subscription";

//fetch data for current page
  useEffect(() => {
    const fetchData = async () => {
      let response;


      response = await fetch(`${url}?page=${curPage - 1}`);

      const data = await response.json();
      console.log('fetched Data for a page',data);
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

      {formShowing && <NewCard showForm={addNewHandler}  removeData={deleteDataHandler} sx={{mt:10}}/>}



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


<Grid container justifyContent="center" alignItems="center" >
  <Grid item>
   <MagicalButton onClickHandler={loadMoreHandler} data={data} currentPage={curPage} totalDataAmount={totalData} remaining={remaining} fetchLimit={fetchLimit}/>
  </Grid>
  <Grid item>
  <Button variant="outlined"  disabled={formShowing} onClick={addNewHandler} /* onClick={() => {history.push('/new')}} */ margin="normal" sx={{ mt: 3,ml: 3 }}>
        Add new
  </Button>
  </Grid>
</Grid>




{/*       <Grid container justifyContent="center" alignItems="center">
        <Grid item>
          <Stack spacing={2}>
            <Pagination page={curPage} count={ Math.ceil(totalData / 3) } onChange={handleChange} />
          </Stack>
        </Grid>
      </Grid> */}
    </Grid>
  );
};

export default PageLayout;

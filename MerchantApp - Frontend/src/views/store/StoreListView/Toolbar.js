import React  from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  makeStyles
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import NewStoreModal from './NewStoreModal'

const useStyles = makeStyles((theme) => ({
  root: {},
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  }
}));


const Toolbar = ({ className,searchStore, ...rest }) => {
  const classes = useStyles();
  const [openModalwindow, setopenModalwindow] = React.useState(false);
  
  const navigate = useNavigate();
  const handleOpen = () => {
    setopenModalwindow(true);
    
  };
  const goToAddStore=()=>{
    navigate("/app/stores/addstore")
  }
  const handleClose = () => {
    setopenModalwindow(false);
  };
  const searchHandler = (event)=>{
    const searchString = event.target.value
    var filter = {}
    if(!isNaN(searchString)){
      console.log("search string contains number only")
      if(searchString.length ===6){
        filter = {
          searchString : parseInt(searchString),
          type : "zipcode"
        }
        searchStore(filter)
        
      }else if(searchString === undefined || searchString === "" ){
        console.log(searchString)
        searchStore()
      }
    }else{
      console.log("search string contains letter")
      if(searchString.length>3){
         filter = {
          searchString : searchString,
          type : "name"
        }
        searchStore(filter)

      }

    }
   // console.log(searchString) 
  }
  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box
        display="flex"
        justifyContent="flex-end"
      >
        <Button className={classes.importButton}>
          Import
        </Button>
       
        <Button
          color="primary"
          variant="contained"
         // onClick={()=>{navigate("/app/stores/addstore")}}
          onClick={()=>{handleOpen()}}
        >
          Add store
        </Button>
      </Box>
      <Box mt={3}>
        <Card>
          <CardContent>
            <Box maxWidth={500}>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon
                        fontSize="small"
                        color="action"
                      >
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  )
                }}
                placeholder="Enter zipcode / store name / area"
                variant="outlined"
                onChange = {searchHandler}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
      <NewStoreModal openModalwindow={openModalwindow} handleClose={handleClose} goToAddStore={goToAddStore}></NewStoreModal>
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string
};

export default Toolbar;

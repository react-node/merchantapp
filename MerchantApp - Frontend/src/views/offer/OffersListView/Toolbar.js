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
  
  const navigate = useNavigate();

  
  const searchHandler = (event)=>{
    const searchString = event.target.value
    var filter = {}

      console.log("search string contains letter")
      if(searchString.length>3){
         filter = {
          searchString : searchString,
          type : "offerName"
        }
        searchStore(filter)

      }else if(searchString === undefined || searchString ===""){
        searchStore()
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
        <Button
          color="primary"
          variant="contained"
          onClick={()=>{navigate("/app/offers/addoffer")}}
         
        >
          Add offer
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
                placeholder="Enter offers name"
                variant="outlined"
                onChange = {searchHandler}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string
};

export default Toolbar;

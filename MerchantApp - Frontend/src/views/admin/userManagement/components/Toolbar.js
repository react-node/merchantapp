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


const Toolbar = ({ className,searchHandler, ...rest }) => {
  const classes = useStyles();
 // const {state} = useContext(UserManagementContext)
  const navigate = useNavigate();
 // console.log(state)
  const createUser=()=>{
    navigate("/app/admin/users/create")
  }

  const changeHandler = (event)=>{
    searchHandler(event.target.value)
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
          onClick={createUser}
         // onClick={()=>{handleOpen()}}
        >
          Create User
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
                placeholder="Enter email / name"
                variant="outlined"
                onChange = {changeHandler}
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

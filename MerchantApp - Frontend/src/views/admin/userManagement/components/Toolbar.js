import React  from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  Box,
  Button,
  makeStyles
} from '@material-ui/core';
const useStyles = makeStyles((theme) => ({
  root: {},
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  }
}));
const Toolbar = ({ className, ...rest }) => {
  const classes = useStyles();
 // const {state} = useContext(UserManagementContext)
  const navigate = useNavigate();
 // console.log(state)
  const createUser=()=>{
    navigate("/app/admin/users/create")
  }
  // const changeHandler = (event)=>{
  //   searchHandler(event.target.value)
  //  // console.log(searchString) 
  // }
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
     
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string
};

export default Toolbar;

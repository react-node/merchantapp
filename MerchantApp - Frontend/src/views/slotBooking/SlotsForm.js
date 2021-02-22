import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Card,
  CardContent,
  makeStyles,
  Typography
} from '@material-ui/core';
import SlotBookingForm from './SlotBookingForm'
import SlotsAvailability from './SlotsAvailability'

const useStyles = makeStyles((theme) => ({
  root: {},
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  }
}));
const SlotsForm = ({ className, type,...rest }) => {
  const classes = useStyles();
  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      
      <Box mt={1}>
        <Card>
          <CardContent>
            <Box >
              
             <SlotBookingForm type={type}></SlotBookingForm>
            </Box>
          </CardContent>
        </Card>
      </Box>
      <br/>
      <SlotsAvailability />
    </div>
  );
};

SlotsForm.propTypes = {
  className: PropTypes.string
};

export default SlotsForm;

import React from 'react';
import clsx from 'clsx';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  makeStyles
} from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { useNavigate } from 'react-router-dom';


const useStyles = makeStyles(() => ({
  root: {},
  actions: {
    justifyContent: 'flex-end'
  },
  statusBadge:{
    marginLeft: 10,
    borderRadius: 10,
    padding: 3,
    paddingLeft:15,
    paddingRight:15
  },
  active:{
    color: "#4caf50",
    backgroundColor: "rgba(76, 175, 80, 0.08)",
   
  },
  expired:{
    color: "#f44336",
    backgroundColor: "rgba(244, 67, 54, 0.08)",
  }
}));

const LatestOrders = ({ className, offersData,...rest }) => {
  const classes = useStyles();
  const navigate =useNavigate()
  const editDisable=(expiredate)=>{
    const currentDate = new Date()
    const currentDateWithouttime = currentDate.setHours(0,0,0,0)
    console.log(currentDateWithouttime)
    const expireDatewithoutTime  =  new Date(expiredate).setHours(0,0,0,0)
    console.log(expireDatewithoutTime)
    if(expireDatewithoutTime< currentDateWithouttime){
        return true
    }else{
        return false
    }
  }
  const getStatus=(status)=>{
    let statusText = ""
    if(status===1){
      statusText = "Submitted"
    }else if(status===2){
      statusText = "Approved"

    }else if(status===3){
      statusText = "Rejected"

    }
    return statusText
  }

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardHeader title="Latest Offers" />
      <Divider />
      <PerfectScrollbar>
        <Box minWidth={800}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Offer Name
                </TableCell>
                <TableCell>
                Active status
                </TableCell>
                <TableCell >
                     From Date
                </TableCell>
                <TableCell>
                     Expire Date
                </TableCell>
                <TableCell>
                  status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {offersData.map((offer) => (
                <TableRow
                  hover
                  key={offer._id}
                >
                  <TableCell>
                    {offer.offerName}
                  </TableCell>
                  <TableCell>
                  {offer.status !==1 ?
                      (editDisable(offer.expireDate) ? (<span className={`${classes.expired} ${classes.statusBadge}`}>Expired  </span>) 
                      :                         
                      (offer.isActive ? (
                          <span className={`${classes.active} ${classes.statusBadge}`}>Active  </span>
                      ) : (<span className={`${classes.expired} ${classes.statusBadge}`}>Inactive  </span>)
                      )):(
                          <span> Status will be updated after approved </span>
                  )} 
                  </TableCell>
                  <TableCell>
                    {moment(offer.fromDate).format('DD/MM/YYYY')}
                  </TableCell>
                  <TableCell>
                    {moment(offer.expireDate).format('DD/MM/YYYY')}
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={offer.status ===1 ? "default": (offer.status ===2? "secondary":"primary")}
                      label={getStatus(offer.status)}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <Box
        display="flex"
        justifyContent="flex-end"
        p={2}
      >
        <Button
          color="primary"
          endIcon={<ArrowRightIcon />}
          size="small"
          variant="text"
          onClick={()=>navigate("/app/offers")}
        >
          View all
        </Button>
      </Box>
    </Card>
  );
};

LatestOrders.propTypes = {
  className: PropTypes.string
};

export default LatestOrders;

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

const DashboardList = ({ className, ...rest }) =>{
    const classes = useStyles();
  return (
    <Card
    className={clsx(classes.root, className)}
    {...rest}
  >
    <CardHeader title="Consolidated on daily bases" />
    <Divider />
    <PerfectScrollbar>
      <Box minWidth={800}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                Type
              </TableCell>
              <TableCell>
                Total
              </TableCell>
              <TableCell>
              Submitted
              </TableCell>
              <TableCell >
                   Approved
              </TableCell>
              <TableCell>
                   Pending
              </TableCell>
              
            </TableRow>
          </TableHead>
          <TableBody>
          <TableRow
                hover
               
              >
                <TableCell>
                  Users
                </TableCell>
                <TableCell>
                  1
                </TableCell>
                <TableCell>
                  1
                </TableCell>
                <TableCell>
                  0
                </TableCell>
                <TableCell>
                  0
                </TableCell>

              </TableRow>
          
          <TableRow
                hover
               
              >
                <TableCell>
                  Stores
                </TableCell>
                <TableCell>
                  1
                </TableCell>
                <TableCell>
                  1
                </TableCell>
                <TableCell>
                  0
                </TableCell>
                <TableCell>
                  0
                </TableCell>

              </TableRow>
              </TableBody>
        </Table>
      </Box>
    </PerfectScrollbar>
    
  </Card>
    )
}
export default DashboardList
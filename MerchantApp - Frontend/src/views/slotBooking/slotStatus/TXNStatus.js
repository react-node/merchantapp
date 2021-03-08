import React, { useEffect, useState } from 'react'
import {
    Box,
    Card,
    CardContent,
    Grid,
    makeStyles,
    Typography
  } from '@material-ui/core';
import clsx from 'clsx';
import { useParams } from 'react-router-dom';
import Services from 'src/services/Services';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { green, red } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
    root: {},
    importButton: {
      marginRight: theme.spacing(1)
    },
    exportButton: {
      marginRight: theme.spacing(1)
    },
    custP: {
      padding:4
    },
    custPL : {
      paddingLeft:16
    },
    success:{
        color : green[600],
        fontSize : 50

    },
    fail : {
        color : red[600],
        fontSize : 50
        

    }
  }));

const TXNStatus =({ className, ...rest })=>{
    const classes = useStyles();
    const {type,orderID} = useParams()
    const [orderDetails , setOrderDetails] = useState([])
    const getOrderDetails = async (orderID)=>{
        try {
            if(orderID){
                
                const getOrderDetails = await Services.getOrderDetails(type,orderID)
                setOrderDetails(getOrderDetails.data)

            }
        } catch (error) {
            
        }

    }
    useEffect(()=>{
      getOrderDetails(orderID)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
   

    return ( <div
        className={clsx(classes.root, className)}
        {...rest}
      >
          <Card>
            <CardContent>
            {
                Object.keys(orderDetails).length > 0 && (
                    <Grid container spacing={3}>
                        <Grid item xs={12} lg={12} md={12} >
                            <Box textAlign="center" >
                            {orderDetails.txn_response_code === "01" ? <CheckCircleOutlineIcon className={classes.success}/> : <HighlightOffIcon  className={classes.fail} />}
                            </Box>
                        </Grid>
                        <Grid item xs={6} lg={3} md={3} >
                           <Typography> Status  :  <b>{orderDetails.txn_response_code === "01" ? "Success" : "Failed"}</b></Typography>
                        </Grid>
                       
                        <Grid item xs={6} lg={3} md={3} >
                        <Typography> Amount : {orderDetails.totalPaid}</Typography>
                        </Grid>
                        <Grid item xs={12} lg={3} md={3} >
                        <Typography> Payment Mode : {orderDetails.txn_payment_mode}</Typography>
                        </Grid>
                        <Grid item xs={12} lg={3} md={3} >
                        <Typography> Order ID : {orderDetails.orderID}</Typography>
                        </Grid>
                        <Grid item xs={12} lg={3} md={3} >
                        <Typography> Message : {orderDetails.txn_res_msg === "Txn Success" ? "Transaction has been success" : orderDetails.txn_res_msg}</Typography>
                        </Grid>
                        <Grid item xs={12} lg={3} md={3} >
                        <Typography> Transaction ID : {orderDetails.transactionID} </Typography>
                        </Grid>
                    </Grid>

                )
            }
            </CardContent>
          </Card>
      </div>)
}

export default TXNStatus
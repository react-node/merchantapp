import React, { useContext, useEffect, useState } from 'react';
import {
    Avatar,
    ButtonBase,
    colors,
    Grid,
    GridList,
    GridListTile,
    makeStyles,
    Paper,
    Switch,
    Tooltip,
    Typography
} from '@material-ui/core';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import CancelIcon from '@material-ui/icons/Cancel';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import EditIcon from '@material-ui/icons/Edit';
import { Link, useNavigate } from 'react-router-dom'
import {  useSnackbar } from 'notistack';
import { GOOGLE_STORAGE_PUBLIC_URL, OFFERS_PATH } from 'src/utils/config';
import { GlobalContext } from "../../../context/GlobalState";
import Services from '../../../services/Services';
import ConfirmDialog from '../../store/StoreDetailView/ConfirmDialog'
import ConfirmationDialogTwo from '../components/ConfirmationDialogTwo'
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/styles';

  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexDirection: 'column'
    },
    avatar: {
      height: 200,
      width: 400
    },
    paper: {
        padding: theme.spacing(2),
        
        maxWidth: "100%",
      },
      image: {
        width: 128,
        height: 128,
      },
      img: {
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
      },
      statsIcon:{
          color:colors.green[300]
      },
      editIcon:{
          color: colors.blue[300]
          
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
  const AntSwitch = withStyles((theme) => ({
    root: {
      width: 28,
      height: 16,
      padding: 0,
      display: 'flex',
    },
    switchBase: {
      padding: 2,
      color: theme.palette.grey[500],
      '&$checked': {
        transform: 'translateX(12px)',
        color: theme.palette.common.white,
        '& + $track': {
          opacity: 1,
          backgroundColor: theme.palette.primary.main,
          borderColor: theme.palette.primary.main,
        },
      },
    },
    thumb: {
      width: 12,
      height: 12,
      boxShadow: 'none',
    },
    track: {
      border: `1px solid ${theme.palette.grey[500]}`,
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor: theme.palette.common.white,
    },
    checked: {},
  }))(Switch);
const OfferInfo =({offerData})=>{
    
    const classes = useStyles();
    const {setSelectedOffer,setLoading} = useContext(GlobalContext);
    const alertPosition = { horizontal: "right", vertical: "top" }
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [dialogOpen,setDialogOpen] = useState(false)
    const [offerStatus,setOfferStatus] = useState(offerData.isActive)
    const [assignedStores,setAssignedStores] = useState([])
    useEffect(()=>{
        if(Object.keys(offerData).length===0){
            navigate("/app/offers")
        }else{
           // setOfferStatus(offerData.isActive)
        }
    },[])
    const editOffer =()=>{
        console.log("edit offer")
        navigate("/app/offer/editoffer")
    }
    const deleteOffer =async ()=>{
        try{
            setLoading(true)
        console.log("delete offer")

        console.log()
        const responseData = await Services.deleteOffer(offerData._id)
        if(responseData.status ===200){
            setSelectedOffer({})
            enqueueSnackbar('Offer Deleted successfully...!',  { variant: "success" ,"anchorOrigin" : alertPosition} );

            navigate("/app/offers")
        }else{
            enqueueSnackbar('Something went wrong, Please try again...!',   { variant: "error","anchorOrigin" : alertPosition } );

        }
        setLoading(false)
    }catch(e){
        console.log(e)
        setLoading(false)
        enqueueSnackbar('Something went wrong, Please try again...!',   { variant: "error","anchorOrigin" : alertPosition } );
    }

    }
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


    const deactivateOffer=async ()=>{
        
            setLoading(true)
            console.log("deactivate the offer", offerData._id)
            setOfferStatus(!offerStatus)
            handleDialogClose()
            try{
                const requestPayload  = [{
                    _id : offerData._id,
                    isActive: !offerStatus
                }]
                const response = await Services.updateOffer(requestPayload)
                if(response.status ===200){
                    enqueueSnackbar('Offer status updated successfully...!',  { variant: "success" ,"anchorOrigin" : alertPosition} );
    
                }else{
                    enqueueSnackbar('Something went wrong, Please try again...!',   { variant: "error","anchorOrigin" : alertPosition } );
    
                }
                setLoading(false)
                navigate("/app/offers")
            }catch(error){
                setLoading(false)
                console.log(error)
                enqueueSnackbar('Something went wrong, Please try again...!',   { variant: "error","anchorOrigin" : alertPosition } );
    
            }
       
        
    }
    const setStatus =()=>{
        setDialogOpen(true)
    }
    const handleDialogClose =()=>{
        setDialogOpen(false)
    }
    const getAssignedStores= async ()=>{
        try{
            if(assignedStores.length ===0){
                setLoading(true)
                console.log(offerData.storeID)
                const StorebasicInfo = await Services.getStoresByID(offerData.storeID)
                console.log(StorebasicInfo.data)
                setAssignedStores(StorebasicInfo.data)
                setLoading(false)
            }
        
        }catch(err){
            setLoading(false)
            enqueueSnackbar('Something went wrong, Please try again...!',   { variant: "error","anchorOrigin" : alertPosition } );

        }
    }
    
    return (
            <div className={classes.root}>
            <Paper className={classes.paper}>
                <Grid container spacing={2}>
                {Object.keys(offerData).length >0 && 
                <Grid item xs={12} sm container>
                    <Grid item xs={11} md={11} container direction="column" spacing={2}>
                    <Grid item xs>
                        <Typography gutterBottom variant="h4" >
                        {offerData.offerName}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                        {offerData.offerDescription}
                        </Typography>
                        
                    </Grid>
                    <Grid item container direction="row" spacing={2}>
                        <Grid item  xs={12} md={4} lg={4} >
                            <Typography variant="body2" >
                                From date : {offerData.fromDate.slice(0, 10)}
                            </Typography>
                        </Grid>
                        <Grid item    xs={12}   md={4}  lg={4}>
                            <Typography variant="body2" >
                                To date : {offerData.expireDate.slice(0, 10)}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item container direction="row" spacing={2}>
                        <Grid item  xs={12} md={4} lg={4} >
                            <Typography variant="body2" >
                                Discount type : {offerData.discountType}
                            </Typography>
                        </Grid>
                        <Grid item    xs={12}   md={4}  lg={4}>
                            <Typography variant="body2" >
                                Discount : {offerData.discount}%
                            </Typography>
                        </Grid>
                        <Grid item    xs={12}   md={4}  lg={4}>
                            <Typography variant="body2" >
                                Status : 
                                {offerData.status !==1 && 
                                    (editDisable(offerData.expireDate) && (<span className={`${classes.expired} ${classes.statusBadge}`}>Expired  </span>) 
                                    ||                          
                                    (offerData.isActive && (
                                        <span className={`${classes.active} ${classes.statusBadge}`}>Active  </span>
                                    ) || (<span className={`${classes.expired} ${classes.statusBadge}`}>Inactive  </span>)
                                    ))||(
                                        <span> Status will be updated after approved </span>
                                    )} 
                               
                                
                            </Typography>
                        </Grid>
                    </Grid>
                    { (!editDisable(offerData.expireDate) && offerData.status!==1) && (
                        <Grid item container direction="row" spacing={2}>
                        <Grid item>Inactive</Grid>
                        <Grid item>
                            <AntSwitch color="secondary" checked={offerStatus} onChange={setStatus} name="offerStatus" />
                        </Grid>
                        <Grid item>Active</Grid>
                        <ConfirmationDialogTwo 
                            open={dialogOpen}
                            handleSubmit = {deactivateOffer}
                            handleCancel = {handleDialogClose}
                            message = {`Are you sure, Do you want to ${offerStatus ? `deactivate` : `Active`}  the offer?`}
                        />
                    </Grid> 
                    )}
                    <br/>
                    <Grid item container direction="row" spacing={2}>
                        <Link
                            component="button"
                            variant="body2"
                            to ="#"
                            onClick={getAssignedStores}
                        >
                            Applied stores
                        </Link>
                    </Grid>

                    <Grid item container direction="row" spacing={2}>
                        {assignedStores.map((item)=>(
                             <Grid key={item._id} item  xs={12} md={3} lg={3} >
                             {item.name},{item.address}
                             </Grid>
                        ))}
                   
                    </Grid>
                    <br />
                    <Grid >
                    <GridList  className={classes.gridList} cols={3} component={"span"}>
                        {offerData.images.map((item) => (
                        <GridListTile key={item._id} cols={item.cols || 1} component={"span"} >
                            <Avatar
                            component={"span"}
                            alt={item.imagePath}
                            src={GOOGLE_STORAGE_PUBLIC_URL+offerData.ownerID+OFFERS_PATH+item.imagePath}
                            variant="square"
                            className={classes.avatar}
                        />
                        
                        </GridListTile>
                        ))}
       
                    </GridList>
                    <br/>
                    <Typography variant="body2" style={{textAlign:"center" }}>
 
                        <ConfirmDialog 
                        deleteItem={deleteOffer} 
                        buttonText="Delete Offer" 
                        message="Are you sure, Do you want to delete the offer?"
                        >
                            <DeleteIcon></DeleteIcon>
                        </ConfirmDialog>
                    </Typography>
                    </Grid>
                    </Grid>
                    <Grid container xs={1} md={1} item justify="flex-end">

                    <Typography variant="subtitle1"> 
                        <ButtonBase
                        onClick = {editOffer}
                        disabled= {editDisable(offerData.expireDate)}
                        >
                            <EditIcon
                                className={classes.editIcon}
                                color="action"
                                
                                />
                                
                        </ButtonBase>
                        <ButtonBase >
                            { offerData.status ===1 && 
                            <Tooltip title="Submitted">
                                <ArrowUpwardIcon
                                    
                                    color="secondary"
                                /> 
                                </Tooltip>
                            }
                            { offerData.status ===2 && 
                             <Tooltip title="Approved">
                                <VerifiedUserIcon
                                    className={classes.statsIcon}
                                    color="action"
                                /> 
                                </Tooltip>
                            }
                            { offerData.status ===3 && 
                            <Tooltip title="Rejected">
                                <CancelIcon
                                    
                                    color="error"
                                /> 
                                </Tooltip>
                            }
                            
                        </ButtonBase>
                    </Typography>
                    </Grid>
                </Grid>
                }
               </Grid>
            </Paper>
            
            </div>
    
    )
}

export default OfferInfo
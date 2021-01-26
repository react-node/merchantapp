import React, { useContext } from 'react';
import {

    Avatar,
    Box,
    Button,
    ButtonBase,
    Card,
    CardContent,
    colors,
    Grid,
    makeStyles,
    Paper,
    Typography

} from '@material-ui/core';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import EditIcon from '@material-ui/icons/Edit';
import { useNavigate } from 'react-router-dom'
import {  useSnackbar } from 'notistack';
import { GOOGLE_STORAGE_PUBLIC_URL } from 'src/utils/config';
import { GlobalContext } from "../../../context/GlobalState";
import Services from '../../../services/Services';
import ConfirmDialog from './ConfirmDialog'
import DeleteIcon from '@material-ui/icons/Delete';

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
          
      }
  }));
const StoreInfo =({store})=>{
    const classes = useStyles();
  const {selectedStore,setSelectedStore} = useContext(GlobalContext);
  const alertPosition = { horizontal: "right", vertical: "top" }
  const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const editStore =()=>{
        console.log("edit store")
        navigate("/app/store/edit")
    }
    const deleteStore =async ()=>{
        try{
        console.log("delete store")

        console.log(selectedStore)
        const responseData = await Services.deleteStore(selectedStore._id)
        if(responseData.status ===200){
            setSelectedStore({})
            enqueueSnackbar('Store Deleted successfully...!',  { variant: "success" ,"anchorOrigin" : alertPosition} );

            navigate("/app/stores")
        }else{
            enqueueSnackbar('Something went wrong, Please try again...!',   { variant: "error","anchorOrigin" : alertPosition } );

        }
    }catch(e){
        console.log(e)
        enqueueSnackbar('Something went wrong, Please try again...!',   { variant: "error","anchorOrigin" : alertPosition } );
    }

    }
    return (
            <div className={classes.root}>
            <Paper className={classes.paper}>
                <Grid container spacing={2}>
                <Grid item>
                <Avatar
                    alt={store.name}
                    src={GOOGLE_STORAGE_PUBLIC_URL+store.owner+"/"+store.profilepic}
                    variant="square"
                    className={classes.avatar}
                />
                </Grid>
                <Grid item xs={12} sm container>
                    <Grid item xs container direction="column" spacing={2}>
                    <Grid item xs>
                        <Typography gutterBottom variant="h4" >
                        {store.name}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                        {store.address}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            
                        </Typography>
                    </Grid>
                    <Grid >

                    <Typography variant="body2" style={{textAlign:"center" }}>
 
                        <ConfirmDialog 
                        deleteStore={deleteStore} 
                        buttonText="Delete Store" 
                        message="Are you sure, Do you want to delete the store?"
                        >
                            <DeleteIcon></DeleteIcon>
                        </ConfirmDialog>
                    </Typography>
                    </Grid>
                    </Grid>
                    <Grid item>

                    <Typography variant="subtitle1"> 
                        <ButtonBase
                        onClick = {editStore}>
                            <EditIcon
                                className={classes.editIcon}
                                color="action"
                                
                                />
                        </ButtonBase>
                        <ButtonBase disabled >
                            <VerifiedUserIcon
                            className={classes.statsIcon}
                            color="action"
                            />
                        </ButtonBase>
                    </Typography>
                    </Grid>
                </Grid>
                </Grid>
            </Paper>
            
            </div>
    
    )
}

export default StoreInfo
import React from 'react'
import {  Avatar,
  colors,
  Grid,
  GridList,
  GridListTile,
  makeStyles,
  Paper,
  Typography} from '@material-ui/core';
import ApprovedButton from '../../CommonComponents/ApprovedButton'
import RejectedButton from '../../CommonComponents/RejectedButton'
import useGetOffersInfo from '../../customHooks/useGetOfferInfo'
import { GOOGLE_STORAGE_PUBLIC_URL,OFFERS_PATH } from 'src/utils/config'

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
    approved:{
      color: "#4caf50",
      backgroundColor: "rgba(76, 175, 80, 0.08)",
     
    },
    submitted:{
      color: "#3645f4",
      backgroundColor: "rgb(54 95 244 / 8%)",
     
    },
    rejected:{
      color: "#f44336",
      backgroundColor: "rgba(244, 67, 54, 0.08)",
    }
}));
const OffersInfoView =()=>{
   const classes = useStyles()
    const [offerData,updateOfferStatus] = useGetOffersInfo()
    const approveUser =()=>{
      updateOfferStatus(offerData._id,2,"")
    }
    const rejectUser =(rejectedMessage)=>{
      console.log(rejectedMessage)
      updateOfferStatus(offerData._id,3,rejectedMessage)
    }
    return ( <div className={classes.root}>
      <Paper className={classes.paper}>
          <Grid container spacing={2}>
          {Object.keys(offerData).length >0 && 
          <Grid item xs={12} sm container>
              <Grid item xs={11} md={11} container direction="column" spacing={2}>
              <Grid item xs>
                  <Typography gutterBottom variant="h4" >
                  {offerData.offerName} - {offerData.offerDescription}
                  </Typography>
              </Grid>
              <Grid item container direction="row" spacing={2}>
                  <Grid item  xs={12} md={4} lg={4} >
                      <Typography variant="body2" >
                        Discount Type : {offerData.discountType}
                      </Typography>
                  </Grid>
                  <Grid item    xs={12}   md={4}  lg={4}>
                      <Typography variant="body2" >
                          Discount : {offerData.discount}
                      </Typography>
                  </Grid>
              </Grid>
              <Grid item container direction="row" spacing={2}>
                  <Grid item  xs={12} md={4} lg={4} >
                      <Typography variant="body2" >
                          Start Date : {offerData.fromDate.slice(0, 10)}
                      </Typography>
                  </Grid>
                  <Grid item    xs={12}   md={4}  lg={4}>
                      <Typography variant="body2" >
                          End Date : {offerData.expireDate.slice(0, 10)}
                      </Typography>
                  </Grid>
                  <Grid item  xs={12} md={4} lg={4} >
                      <Typography variant="body2" >
                          Offer Status : {offerData.isActive ? "Active" : "Deactive"}
                      </Typography>
                  </Grid>
              </Grid>
              <Grid item container direction="row" spacing={2}>
                  <Grid item    xs={12}   md={4}  lg={4}>
                      <Typography variant="body2" >
                        Created Date : {offerData.createdAt.slice(0, 10)}
                      </Typography>
                  </Grid>
                  <Grid item    xs={12}   md={4}  lg={4}>
                      <Typography variant="body2" >
                          Status : 
                          {offerData.status ===1 ? 
                          <span className={`${classes.submitted} ${classes.statusBadge}`}>Submitted  </span>
                            : (offerData.status ===2 ? <span className={`${classes.approved} ${classes.statusBadge}`}>Approved  </span> 
                             : <span className={`${classes.rejected} ${classes.statusBadge}`}>Rejected  </span>)} 
                      </Typography>
                  </Grid>
                  {offerData.rejectedMessage && 
                    <Grid item  xs={12} md={4} lg={4} >
                      <Typography variant="body2" >
                        Rejected Message : {offerData.rejectedMessage}
                      </Typography>
                    </Grid>
                  }
              </Grid>
              <br />
              <Grid >
              <GridList className={classes.gridList} cols={3} component={"span"}>
                        {offerData.images.map((item) => (
                          <a key={item._id} href={GOOGLE_STORAGE_PUBLIC_URL+offerData.ownerID+OFFERS_PATH+item.imagePath} target="_blank" rel="noopener noreferrer">
                            <GridListTile  cols={item.cols || 1} component={"span"} >
                                <Avatar
                                component={"span"}
                                alt={item.imagePath}
                                src={GOOGLE_STORAGE_PUBLIC_URL+offerData.ownerID+OFFERS_PATH+item.imagePath}
                                variant="square"
                                className={classes.avatar}
                            />
                            </GridListTile>
                          </a>
                        ))}
                    </GridList>
                <br/>
                <Typography variant="body2" style={{textAlign:"center" }}>
                 <ApprovedButton onButtonClick={approveUser}/>
                 &nbsp; 
                 <RejectedButton onButtonClick={rejectUser}/>
                 </Typography>
              </Grid>
              </Grid>
          </Grid>
          }
         </Grid>
      </Paper>
      </div>)
}

export default OffersInfoView
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
import useGetStoreBannerInfo from '../../customHooks/useGetStoreBannerInfo'
import { GOOGLE_STORAGE_PUBLIC_URL } from 'src/utils/config'

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
const StoresBannerInfoView =()=>{
   const classes = useStyles()
    const [bannerData,updateBannerStatus] = useGetStoreBannerInfo()
    const approveUser =()=>{
      updateBannerStatus(bannerData._id,2,"")
    }
    const rejectUser =(rejectedMessage)=>{
      console.log(rejectedMessage)
      updateBannerStatus(bannerData._id,3,rejectedMessage)
    }
    return ( <div className={classes.root}>
      <Paper className={classes.paper}>
          <Grid container spacing={2}>
          {Object.keys(bannerData).length >0 && 
          <Grid item xs={12} sm container>
              <Grid item xs={11} md={11} container direction="column" spacing={2}>
              <Grid item xs>
                  <Typography gutterBottom variant="h4" >
                  {bannerData.imagePath}
                  </Typography>
              </Grid>
              <Grid item container direction="row" spacing={2}>
                  <Grid item    xs={12}   md={4}  lg={4}>
                      <Typography variant="body2" >
                        Created Date : {bannerData.createdAt.slice(0, 10)}
                      </Typography>
                  </Grid>
                  <Grid item    xs={12}   md={4}  lg={4}>
                      <Typography variant="body2" >
                          Status : 
                          {bannerData.status ===1 ? 
                          <span className={`${classes.submitted} ${classes.statusBadge}`}>Submitted  </span>
                            : (bannerData.status ===2 ? <span className={`${classes.approved} ${classes.statusBadge}`}>Approved  </span> 
                             : <span className={`${classes.rejected} ${classes.statusBadge}`}>Rejected  </span>)} 
                      </Typography>
                  </Grid>
                  {bannerData.rejectedMessage && 
                    <Grid item  xs={12} md={4} lg={4} >
                      <Typography variant="body2" >
                        Rejected Message : {bannerData.rejectedMessage}
                      </Typography>
                    </Grid>
                  }
              </Grid>
              <br />
              <Grid >
              <GridList  className={classes.gridList} cols={3} component={"span"}>
                    <a  href={GOOGLE_STORAGE_PUBLIC_URL+bannerData.ownerID+"/banner/"+bannerData.imagePath} target="_blank" rel="noopener noreferrer">
                      <GridListTile  cols={1} component={"span"} >
                      <Avatar
                      component={"span"}
                      alt={bannerData.imagePath}
                      src={GOOGLE_STORAGE_PUBLIC_URL+bannerData.ownerID+"/banner/"+bannerData.imagePath}
                      variant="square"
                      className={classes.avatar}
                      />
                      </GridListTile>
                    </a>
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

export default StoresBannerInfoView
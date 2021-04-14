import React from 'react'
import {  Avatar,
  colors,
  Grid,
  GridList,
  GridListTile,
  GridListTileBar,
  makeStyles,
  Paper,
  Typography} from '@material-ui/core';
import ApprovedButton from '../../CommonComponents/ApprovedButton'
import RejectedButton from '../../CommonComponents/RejectedButton'
import useGetUserInfo from '../../customHooks/useGetUserInfo';
import { GOOGLE_STORAGE_PUBLIC_URL } from 'src/utils/config';

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
const UsersInfoView =()=>{
  const classes = useStyles()
    const [userData,updateUserStatus] = useGetUserInfo()
    
    console.log("userData....",userData)
    const approveUser =()=>{
      updateUserStatus(userData._id,2,"")
    }
    const rejectUser =(rejectedMessage)=>{
      console.log(rejectedMessage)
      updateUserStatus(userData._id,3,rejectedMessage)

    }
    

    return ( <div className={classes.root}>
      <Paper className={classes.paper}>
          <Grid container spacing={2}>
          {Object.keys(userData).length >0 && 
          <Grid item xs={12} sm container>
              <Grid item xs={11} md={11} container direction="column" spacing={2}>
              <Grid item xs>
                  <Typography gutterBottom variant="h4" >
                  {userData.firstName} {userData.lastName}
                  </Typography>
              </Grid>
              <Grid item container direction="row" spacing={2}>
                  <Grid item  xs={12} md={4} lg={4} >
                      <Typography variant="body2" >
                          Email : {userData.email}
                      </Typography>
                  </Grid>
                  <Grid item    xs={12}   md={4}  lg={4}>
                      <Typography variant="body2" >
                          Phone : {userData.phoneNumber}
                      </Typography>
                  </Grid>
              </Grid>
              <Grid item container direction="row" spacing={2}>
                  <Grid item  xs={12} md={4} lg={4} >
                      <Typography variant="body2" >
                          Aadhaar : {userData.identityProofs[1].id_number}
                      </Typography>
                  </Grid>
                  <Grid item    xs={12}   md={4}  lg={4}>
                      <Typography variant="body2" >
                          PAN : {userData.identityProofs[0].id_number}
                      </Typography>
                  </Grid>
                  <Grid item  xs={12} md={4} lg={4} >
                      <Typography variant="body2" >
                          Created Date : {userData.createdAt.slice(0, 10)}
                      </Typography>
                  </Grid>
              </Grid>
              <Grid item container direction="row" spacing={2}>
                  
                  <Grid item    xs={12}   md={4}  lg={4}>
                      <Typography variant="body2" >
                          ID Proof Verified : {userData.isIDProofVerified ? "Yes" : "No"}
                      </Typography>
                  </Grid>
                  <Grid item    xs={12}   md={4}  lg={4}>
                      <Typography variant="body2" >
                          Status : 
                          {userData.status ===1 ? 
                          <span className={`${classes.submitted} ${classes.statusBadge}`}>Submitted  </span>
                            : (userData.status ===2 ? <span className={`${classes.approved} ${classes.statusBadge}`}>Approved  </span> 
                             : <span className={`${classes.rejected} ${classes.statusBadge}`}>Rejected  </span>)} 
                      </Typography>
                  </Grid>
                  {userData.rejectedMessage && 
                    <Grid item  xs={12} md={4} lg={4} >
                      <Typography variant="body2" >
                        Rejected Message : {userData.rejectedMessage}
                      </Typography>
                    </Grid>
                  }
                  
              </Grid>
              <br />
              <Grid >
              <GridList  className={classes.gridList} cols={3} component={"span"}>
                  {userData.identityProofs.map((item) => (
                    <a key={item._id} href={GOOGLE_STORAGE_PUBLIC_URL+userData._id+item.upload_path} target="_blank" rel="noopener noreferrer">
                      <GridListTile  cols={item.cols || 1} component={"span"} >
                      <Avatar
                      component={"span"}
                      alt={item.upload_path}
                      src={GOOGLE_STORAGE_PUBLIC_URL+userData._id+item.upload_path}
                      variant="square"
                      className={classes.avatar}
                      />
                       <GridListTileBar
                        title={item.id_type}
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

export default UsersInfoView
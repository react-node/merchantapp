import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import { Avatar, Box, Card, Grid } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ShareIcon from '@material-ui/icons/Share';
import Pagination from './Pagination';
import { GOOGLE_STORAGE_PUBLIC_URL ,OFFERS_PATH} from 'src/utils/config';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 400,
    flexGrow: 1,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    height: 50,
    paddingLeft: theme.spacing(4),
    backgroundColor: theme.palette.background.default,
  },
  img: {
    height: 255,
    display: 'block',
    // maxWidth: 400,
    overflow: 'hidden',
    width: '100%',
  },
  avatar: {
    height: 255,
    width: "100%",
    // maxWidth: 400,
    cursor:"pointer"
  },
  statsItem: {
    alignItems: 'center',
    display: 'flex'
  },
  statsIcon: {
    marginRight: theme.spacing(1)
  },

  cutomStatus:{
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
  rejected:{
    color: "#f44336",
    backgroundColor: "rgba(244, 67, 54, 0.08)",
   
  },
  submitted:{
    color: "#ff9800",
    backgroundColor: "rgba(255, 152, 0, 0.08)"
  },
  storeName:{
    textOverflow : "ellipsis",
    overflow:"hidden",
    whiteSpace:"nowrap",
    marginBottom:8
    },
    card:{
        "&:hover" :  {
            transition: "all 0.2s ease-out",
            boxShadow:" 0px 4px 8px rgba(38, 38, 38, 0.2)",
            top:" -4px",
            border: "1px solid #cccccc",
            backgroundColor: "white",
          },
        
          "&:before ": {
            content: "",
            position: "absolute",
            zIndex: -1,
            top: "-16px",
            right: "-16px",
            background: "#00838d",
            height: "32px",
            width: "32px",
            borderRadius: "32px",
            transform: "scale(2)",
            transformOrigin: "50% 50%",
            transition: "transform 0.15s ease-out",
          },
        
          "&:hover:before" : {
            transform: "scale(2.15)",
          }
    }
}));
const styles = {
    root: {
      position: 'relative',
      
    },
    slide: {
      padding: 15,
      minHeight: 100,
      color: '#fff',
    },
    slide1: {
      backgroundColor: '#FEA900',
    },
    slide2: {
      backgroundColor: '#B3DC4A',
    },
    slide3: {
      backgroundColor: '#6AC0FF',
    },
    imageFit:{
      objectFit: "fill"
    }
    
  };
function OfferCard({offer,storeID,goToDetails,offerMetaData}) {
  
  const classes = useStyles();
  const [activeStep] = React.useState(0);
  const [index, setIndex] = React.useState(0);
  const [start, setStart] = React.useState(false);

  // const handleNext = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep + 1);
  // };

  // const handleBack = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep - 1);
  // };

  // const handleStepChange = (step) => {
  //   setActiveStep(step);
  // };
  const gotoOfferDetails=(offerID,storeID)=>{
    //navigate(`/store/${storeID}/${offerID}`)
    goToDetails(storeID,offerID)
  }
  const handleChangeIndex = index => {
   // if(!start){
      setIndex(index)

   // }
  };

  return (
    <div style={styles.root} >
        <Card className={classes.card}>
       <AutoPlaySwipeableViews autoplay={start} enableMouseEvents index={index} onChangeIndex={handleChangeIndex}>
       
       {offer.images.map((step, index) => (
         
         <div key={step._id}
         onMouseEnter={()=>setStart(true)}
         onMouseLeave={()=>setStart(false)}
          >
            {Math.abs(activeStep - index) <= 2  && (
        <Avatar
        classes={{img:classes.imageFit}}  
        alt={offer.offerName}
        src={GOOGLE_STORAGE_PUBLIC_URL+offer.ownerID+OFFERS_PATH+step.imagePath}
        variant="square"
        className={classes.avatar}
        onClick={()=>gotoOfferDetails(offer._id,storeID)}
      />
       
      ) }
         </div>

      
      
     ))}
        </AutoPlaySwipeableViews>
        <Pagination dots={offer.images.length} index={index} onChangeIndex={handleChangeIndex} />
      <Paper square elevation={0}>
      <Box p={1} mb={0.6}>
      <Grid
            className={classes.statsItem}
            item
          >
            <Grid item
            md={10}
            xs={10}
            
            className={classes.storeName}>
            <Typography
              color="textPrimary"
              display="inline"
              variant="subtitle1"
            >
              {offer.offerName}
            </Typography>
            </Grid>
           
          </Grid>
        <Grid
          container
          justify="space-between"
          spacing={2}
        >
          
          <Grid
            className={classes.statsItem}
            item
          >
            <VisibilityIcon
              className={classes.statsIcon}
              color="action"
              onClick = {()=>offerMetaData('views',offer._id)}
            />
            <Typography
              color="textSecondary"
              display="inline"
              variant="body2"
            >
              {offer.views}
            </Typography>
          </Grid>
          <Grid
            className={classes.statsItem}
            item
          >
            <ThumbUpIcon
              onClick = {()=>offerMetaData('likes',offer._id)}
              className={classes.statsIcon}
              color="action"
            />
            <Typography
              color="textSecondary"
              display="inline"
              variant="body2"
            >
              {offer.likes}
            </Typography>
          </Grid>
          <Grid
            className={classes.statsItem}
            item
          >
            <ShareIcon
              className={classes.statsIcon}
              color="action"
            />
            <Typography
              color="textSecondary"
              display="inline"
              variant="body2"
            >
              {offer.shares}
            </Typography>
          </Grid>
        </Grid>
      </Box>
      </Paper>
      </Card>
    </div>
  );
}

export default OfferCard;

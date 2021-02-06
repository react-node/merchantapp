import React, { useContext } from 'react';
import {useNavigate} from 'react-router-dom'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import { Avatar, Box, Grid } from '@material-ui/core';
import { GOOGLE_STORAGE_PUBLIC_URL ,OFFERS_PATH} from 'src/utils/config';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ShareIcon from '@material-ui/icons/Share';
import {GlobalContext} from 'src/context/GlobalState'

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
    maxWidth: 400,
    overflow: 'hidden',
    width: '100%',
  },
  avatar: {
    height: 255,
    width: "100%",
    maxWidth: 400,
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
  }
}));

function SwipeableTextMobileStepper({offer}) {
  
  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const {setSelectedOffer} = useContext(GlobalContext)
  const navigate = useNavigate()
  const maxSteps = offer.images.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };
  const gotoDetails=()=>{
    setSelectedOffer(offer)
    navigate("/app/offers/offerdetail")
  }

  return (
    <div className={classes.root} >
      
      <AutoPlaySwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {offer.images.map((step, index) => (
         
            <div key={step._id}>
               {Math.abs(activeStep - index) <= 2  && (
           <Avatar
           alt={offer.offerName}
           src={GOOGLE_STORAGE_PUBLIC_URL+offer.ownerID+OFFERS_PATH+step.imagePath}
           variant="square"
           className={classes.avatar}
           onClick={gotoDetails}
         />
          
         ) }
            </div>

         
         
        ))}
      </AutoPlaySwipeableViews>
      <Paper square elevation={0}>
      <Box p={2}>
      <Grid
            className={classes.statsItem}
            item
          >
            <Grid item
            md={8}
            xs={8}>
            <Typography
              color="textSecondary"
              display="inline"
              variant="caption"
            >
              {offer.offerName}
            </Typography>
            </Grid>
            <Grid item
            md={4}
            xs={4}
            align="right">
              
            <Typography
              color="textSecondary"
              display="inline"
              variant="caption"
              className={`${classes.cutomStatus} ${offer.status===1 ? classes.submitted : (offer.status===2 ? classes.approved : classes.rejected)}`}
            >
              {offer.status ===1 ? "Submitted" : (
                offer.status===2 ? "Approved" : "Rejected"
              )}
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
      <MobileStepper
       variant="dots"
        steps={maxSteps}
        position="static"
       
        activeStep={activeStep}
        nextButton={
          <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
            Next
            {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            Back
          </Button>
        }
      />
    </div>
  );
}

export default SwipeableTextMobileStepper;

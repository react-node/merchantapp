import React from 'react'
import { Box, Grid, makeStyles, Typography } from '@material-ui/core'
import TwitterIcon from '@material-ui/icons/Twitter';
import InstagramIcon from '@material-ui/icons/Instagram';
import FacebookIcon from '@material-ui/icons/Facebook';
import Logo from './Logo'

const useStyles = makeStyles(theme =>({
    root:{
        background: "#000000"
    },
    maginTop:{
        [theme.breakpoints.only('xs')]: {
            marginTop:5,
            alignItems:"flex-start"
          },
          
    },
    facebook:{
        color:"#4267B2"
    },
    twitter : {
        color:"#1DA1F2"
    },
    instagram : {
        color:"#cd486b"
    }
}))
const Footer = ()=>{
    const classes = useStyles()
    return (
    <footer className={classes.root}>
        
        <div >
        <div >
            <br/>
        <Grid style={{color:'white',padding:15}}> 
         <Box ><Typography style={{fontSize:15,fontWeight:600,paddingBottom:10}}>Amazing offers available on infydealz</Typography></Box>
         <Box ><Typography style={{fontSize:12,    textAlign: "justify",color:'#ffffffcf'}}>Infydealz helps you discover the best things to do, eat and buy – wherever you are! Make every day awesome with infydealz. Dine at the finest restaurants, relax at the best spas, pamper yourself with exciting wellness and shopping offers or just explore your city intimately… you will always find a lot more to do with nearbuy. From tattoo parlors to music concerts, movie tickets to theme parks, everything you want is now within reach. Don't stop yet! Take it wherever you go with the nearbuy mobile app. Based on your location and preference, our smart search engine will suggest new things to explore every time you open the app. What's more, with offers on everything around you... you are sure to try something new every time.</Typography></Box>
        </Grid>   
   </div>
   </div>
    <div style={{color:'white',padding:15}}>
   
    <Grid container >
    <Grid container item spacing={3} md={6} xs={12}>
        <Grid item >
                <Typography  >Home</Typography>
        </Grid>
        <Grid item  >
                <Typography  >About</Typography>
        </Grid>
        <Grid item  >
                <Typography  >Policy</Typography>
        </Grid>
        <Grid item >
                <Typography  >Contact US</Typography>
        </Grid>
       
        </Grid>
        <Grid  container item className={classes.maginTop} spacing={3}  md={3} xs={12}>
        <Grid item >
                <Typography  >Follow Us</Typography>
        </Grid>
        <Grid item >
                <TwitterIcon  className={classes.twitter}/>
        </Grid>
        <Grid item >
                <InstagramIcon className={classes.instagram}/>
        </Grid>
        <Grid item >
                <FacebookIcon className={classes.facebook}/>
        </Grid>
        </Grid>
        <Grid direction="column" className={classes.maginTop}  container item spacing={3}  md={3} xs={12} alignItems="flex-end">
        <Grid item >
               <Logo style={{width:100}}/>
        </Grid>
        
        </Grid>
        
        </Grid>
        <br/>
        <Typography>Copyright &#169; infydeals.com. All rights reserved.</Typography>
    
    </div>
   </footer>)
}

export default Footer
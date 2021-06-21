import React, {  useEffect, useState } from "react";
import Slider from "react-slick";
import {  makeStyles, GridList, GridListTile, Avatar, GridListTileBar, IconButton, Typography } from "@material-ui/core";
import useLocationData from "src/hooks/useLocationData";
import useDashboard from "src/hooks/useDashboard";


const useStyles = makeStyles((theme) => ({
  root: {
    background: "#454064"
  },
  gridList:{
    marginTop : "25px !important",
    marginRight:"15px !important"
  },
  avatar: {
    height: "inherit",
    width: "100%"
  },
  dots: {
    bottom: 0,
    "& li.slick-active button::before": {
      color: theme.palette.secondary.main
    },
    "& li": {
      "& button::before": {
        fontSize: theme.typography.pxToRem(14),
        color: "#fff",
        opacity: 0.5
      }
    }
  },
  fullWidth:{
    width:"100% !important",
    height:"320px !important"
  },
  slickPrev:{
    left: 50,
    zIndex: 1
  },
  slickNext:{
    right: 50,
    
  },
  slickSlider:{
    marginRight: -15,
    overflow:"hidden",
    "& .slick-next" :{
      right: 25,
      
    },
    "& .slick-next:before, .slick-prev:before" :{
      color: "#636363e0",
      fontSize: 25
    },
    "& .slick-prev" : {
      left: 5,
      zIndex: 1,
    },
  },
  title:{
    marginTop:5,
    marginBottom:-10
  }
}));
const MultiSlideShow =()=> {
  console.log("Multi slideshow&&&&&&&&&")
  const [multiSliderData, setMultiSliderData] = useState([])
  const {zipcode} = useLocationData()
  const {getPaidOffers} = useDashboard()
  const getMultiSliderOffers = async (zipcode)=>{
    const resp = await getPaidOffers(zipcode)
    
    const data= resp.filter(item=> item.offerName)
    setMultiSliderData(data)
    console.log(resp)

  }
  useEffect(()=>{
    if(zipcode)
    getMultiSliderOffers(zipcode)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[zipcode])
  const classes = useStyles();
    const settings = {
      dots: false,
      //infinite: true,
      slidesToShow: multiSliderData.length <3 ? multiSliderData.length : 3, // we should return min 3 offers  then only it displays good in UI 
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000,
      className :`slick-slider ${classes.slickSlider} ` ,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
          //  infinite: true,
            dots: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]  
      
    }
    
    return (
      <div>
        <Typography component="div"><h2 className={classes.title}>Popular Deals</h2></Typography>
        <Slider {...settings}>
          
          {multiSliderData.length>0 && multiSliderData.map(item=>(
           <div key={item._id}>
           <GridList  className={classes.gridList} cols={3} component={"span"}>
              
                <GridListTile  cols={ 1} component={"span"}  classes={{root:classes.fullWidth}}>
                  <Avatar
                  component={"span"}
                  alt={item.images[0].imagePath}
                  src={item.images[0].imagePath}
                  variant="square"
                  className={classes.avatar}
                />
                <GridListTileBar
                    title={item.offerName}
                    subtitle={<span>Uploaded Date: </span>}
                    actionIcon={
                      <IconButton aria-label={`info about Offer`} className={classes.icon}>
                        
                      </IconButton>
                    }
                  
                  />
                </GridListTile>
            
                </GridList>
            </div>
          ))}
           
        </Slider>
      </div>
    );
}

export default  MultiSlideShow
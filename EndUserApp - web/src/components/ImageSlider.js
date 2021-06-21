import React from "react";
import Slider from "react-slick";
import {  makeStyles, Avatar } from "@material-ui/core";
import * as config from '../utils/config'

const useStyles = makeStyles((theme) => ({
  root: {
    background: "#454064"
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
  
  imageFit:{
    objectFit:"fill",
  },
  imageHeight : {
   
    [theme.breakpoints.only('xs')]: {
      height:125,
      width:"100%"
    },
    [theme.breakpoints.up('sm')]: {
      height:250,
      width:"100%"
    },
  }
  
}));
const ImageSlider=({fadeImages})=> {
  const classes = useStyles();
console.log("Image slider&&&&&&&&")
const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  adaptiveHeight: true,
  dotsClass: `slick-dots ${classes.dots}`,
  arrows: false
  
};

    return (
      <div >
       
        <Slider {...settings}>
          {fadeImages.length>0 && fadeImages.map(item=>(
            <div key={item._id}>
              <Avatar classes={{img:classes.imageFit}}  
              variant="square" 
              className={classes.imageHeight}
               src={`${config.GOOGLE_STORAGE_PUBLIC_URL}${item.ownerID}/banners/${item.imagePath}`} />
            </div>
          ))

          }
        
        </Slider>
      </div>

    )
     
 
}

export default ImageSlider
import { makeStyles, Typography } from "@material-ui/core"
import React from "react"
import SearchForm from "./Toolbar"
import SimpleTable from './SimpleTable'

const useStyles = makeStyles((theme)=>{
    root:{}
})

const BannerHistory = ()=>{
    const classes = useStyles();
    console.log("slots history...!")
    return (
       <>
       <SearchForm type="banner" />
       <br />
        <SimpleTable  type="banner"  />
       </>
    )
}

export default BannerHistory
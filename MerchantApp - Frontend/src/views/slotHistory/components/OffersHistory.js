import { Grid, makeStyles, Typography } from "@material-ui/core"
import React from "react"
import SearchForm from './Toolbar'
import SimpleTable from './SimpleTable'
const useStyles = makeStyles((theme)=>{
    root:{}
})

const OfferHistory = ()=>{
    const classes = useStyles();
    console.log("offers history...!")
    return (
        <>
        <SearchForm type="offer" />
        <br />
        <SimpleTable  type="offer"  />
        </>
    )
}

export default OfferHistory
import React from "react"
import SearchForm from './Toolbar'
import SimpleTable from './SimpleTable'

const OfferHistory = ()=>{
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
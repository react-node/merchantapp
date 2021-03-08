import React from "react"
import SearchForm from "./Toolbar"
import SimpleTable from './SimpleTable'
const BannerHistory = ()=>{
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
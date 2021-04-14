import React from 'react'
import { Button, makeStyles } from '@material-ui/core'
const useStyles = makeStyles((theme) => ({
    approved : {
        background: 'linear-gradient(45deg, #37b162 100%, #e5ff53 90%)',
       
        color: 'white',
      
    }

}))
const ApprovedButton = ({onButtonClick})=>{
    const classes = useStyles()

    return (<Button
       onClick={onButtonClick}
        className = {classes.approved}
        variant="contained"
      >
        Approve
      </Button>)
}

export default ApprovedButton
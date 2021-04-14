import React, { useState } from 'react'
import { Button, colors, Fade, makeStyles, Modal, TextareaAutosize, Typography } from '@material-ui/core'
import Backdrop from '@material-ui/core/Backdrop';


const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      paper: {
    
        marginBottom: theme.spacing(2),
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
      },
      error:{
          color: colors.red[500]
      }

}))
const RejectedButton = ({onButtonClick})=>{
    const classes = useStyles()
    const [open,setOpen] = useState(false)
    const [rejectedMessage, setRejectedMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const changeHandler = (e)=>{
        setRejectedMessage(e.target.value)
        if(e.target.value){
            setErrorMessage("")
        }else{
            setErrorMessage("Please enter reason(s) to reject")
        }
    }
    const handleClose = () => {
        setOpen(false);
    };
    const OpenModalwindow=()=>{
        setOpen(true);
    }

    const submitWithMessage =()=>{
        if(!rejectedMessage){
            setErrorMessage("Please enter reason(s) to reject")
            return false
        }
        onButtonClick(rejectedMessage)
    }
    return (
        <>
        <Button
            color="primary"
            variant="contained"
            onClick = {OpenModalwindow}
        >
            Reject
        </Button>
        <Modal
            aria-labelledby="store-slot-details"
            aria-describedby="store-slot-details-description"
            className={classes.modal}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
            timeout: 500,
            }}
        >
            <Fade in={open}>
            <div component="paper" className={classes.paper}>
                <Typography id="store-slot-details" align="center">Enter rejected message & submit</Typography>
                <br />
                <TextareaAutosize aria-label="minimum height" value={rejectedMessage} rowsMin={8} style={{width:"100%"}} placeholder="Enter Message" onChange={changeHandler} />
                <br />
                <Typography className={classes.error}>{errorMessage}</Typography> 
                <br />
                <Typography  style={{textAlign:"right" }}>
                <Button
                    color="secondary"
                    variant="contained"
                    onClick = {submitWithMessage}
                    >
                    Submit
                </Button>
                &nbsp;
                <Button
                    color="primary"
                    variant="contained"
                    onClick = {handleClose}
                    >
                    Cancel
                </Button>
                </Typography>
                </div>
            </Fade>
        </Modal>
        </>
      )
}

export default RejectedButton
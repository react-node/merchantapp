import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Box, IconButton } from '@material-ui/core';
export default function AlertDialog({deleteItem,message,buttonText,children,buttonType}) {

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleDeleteStore=()=>{
      deleteItem()
      setOpen(false);
  }

  return (
    <Box component={'span'}  >
      {buttonType === "iconButton" ? (
        <IconButton onClick={handleClickOpen} >
          {children}
        </IconButton>
      ) : (
        <Button  variant="outlined" color="primary" onClick={handleClickOpen}>
          {children}  {buttonText}
        </Button>
      )}
      
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{message}</DialogTitle>
        
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
          <Button onClick={handleDeleteStore} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

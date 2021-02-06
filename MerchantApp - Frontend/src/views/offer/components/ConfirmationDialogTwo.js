import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Box, IconButton } from '@material-ui/core';
export default function ConfirmationDialogTwo({handleSubmit,open,message,handleCancel}) {

  //const [open, setOpen] = React.useState(open);
//   const handleClickOpen = () => {
//     setOpen(true);
//   };

  const handleClose = () => {
    handleCancel();
  };
//   const handleDeleteStore=()=>{
//     handleSubmit()
//     //setOpen(false);
//   }

  return (
    <Box component={'span'}  >
      
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
          <Button onClick={handleSubmit} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Avatar, Grid, makeStyles, Typography, Zoom } from '@material-ui/core';
import { Formik } from 'formik';
import * as Yup from 'yup';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles((theme)=>({
    loginBackground :{
        background : theme.palette.primary.main,
        display:"flex",
        justifyContent:"center"
    },
    avatar:{
        width:"fit-content",
        display:"inline-block",
        height:"auto",
    

    },
    imageFit:{
        objectFit:"contain",
      },
      linkStyle:{
        cursor: "pointer"
      }
}))
const FormDialog = ({open,handleClose,handleFormSubmit,sendForgotpasswordLink})=> {
 const classes = useStyles()
 const [isLoading,setIsLoading] = useState(false)
 const [showLogin,setShowLogin] = useState(true)
 const [showFPWD,setShowFPWD] = useState(false)
 const showForgotpassword = ()=>{
  setShowLogin(false)
  setShowFPWD(true)
  
 }
 const showLoginfn = ()=>{
  setShowFPWD(false)
  setShowLogin(true)

 }


  return (
    <div>
        <Dialog open={open}  onClose={handleClose} aria-labelledby="form-dialog-title">
        {isLoading && <LinearProgress />}
            <Grid container  >
                <Grid item xs={12} md={6} className={classes.loginBackground}>
                    <Avatar classes={{img:classes.imageFit}} variant="square" className={classes.avatar} src="/static/InfyDealsLogo.png"/>
                </Grid>
                
                <Grid item xs={12}  md={6}>
                {showLogin && (<Zoom in={showLogin}>
                  <div>
                <DialogTitle id="form-dialog-title">Login / Sign up</DialogTitle>
              
                <Formik
                    initialValues={{
                      email: '',
                      password: ''
                    }}
                    validationSchema={Yup.object().shape({
                      email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                      password: Yup.string().max(255).required('Password is required')
                    })}
                    onSubmit={async (values) => {
                      console.log("login form....",values)
                      try{
                        setIsLoading(true)
                        await handleFormSubmit(values)
                        setIsLoading(false)
                      }catch(err){
                        setIsLoading(false)
                      }
                    }}
                  >
                    {({
                      errors,
                      handleBlur,
                      handleChange,
                      handleSubmit,
                      isSubmitting,
                      touched,
                      values
                    }) => (
                      <form onSubmit={handleSubmit}>
                <DialogContent>
                <TextField
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
                onBlur={handleBlur}
                onChange={handleChange}
                  autoFocus
                  margin="dense"
                  id="email"
                  label="Email Address"
                  type="email"
                  value={values.email}
                  fullWidth
                />
                <TextField
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
                onBlur={handleBlur}
                onChange={handleChange}
                  autoFocus
                  margin="dense"
                  id="password"
                  label="Password"
                  type="password"
                  value={values.password}
                  fullWidth
                />
                </DialogContent>
                <DialogTitle id="form-dialog-title">
                  <Typography color="primary" className={classes.linkStyle} onClick={showForgotpassword}>Forgot password?</Typography>
                  </DialogTitle>
                  <DialogContent>
                  <Typography variant="subtitle2" color="secondary">By clicking submit you are agreeing to the Terms and Conditions. </Typography>
                  </DialogContent>
                  
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    Cancel
                  </Button>
                  <Button  type="submit" color="inherit">
                    Submit
                  </Button>
                </DialogActions>
        
        </form>)}
        </Formik>
                </div>
                </Zoom>)}
                {showFPWD && (<Zoom in={showFPWD}>
                  <div>
                <DialogTitle id="form-dialog-title">Forgot Password</DialogTitle>
              
                <Formik
                    initialValues={{
                      email: '',
                    }}
                    validationSchema={Yup.object().shape({
                      email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    })}
                    onSubmit={async (values) => {
                      console.log("forgot password form....",values)
                      try{
                        setIsLoading(true)
                        await sendForgotpasswordLink(values)
                        setIsLoading(false)
                      }catch(err){
                        setIsLoading(false)
                      }
                    }}
                  >
                    {({
                      errors,
                      handleBlur,
                      handleChange,
                      handleSubmit,
                      isSubmitting,
                      touched,
                      values
                    }) => (
                      <form onSubmit={handleSubmit}>
                <DialogContent>
                <TextField
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
                onBlur={handleBlur}
                onChange={handleChange}
                  autoFocus
                  margin="dense"
                  id="email"
                  label="Email Address"
                  type="email"
                  value={values.email}
                  fullWidth
                />
               
                </DialogContent>
                <DialogTitle id="form-dialog-title">
                  <Typography color="primary" className={classes.linkStyle} onClick={showLoginfn}>Login or SignUp</Typography>
                  </DialogTitle>
                  <DialogContent>
                  <Typography variant="subtitle2"  color="secondary">Link will send to your registerd email address. you can rest the password by using link. </Typography>
                  </DialogContent>
                  
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    Cancel
                  </Button>
                  <Button  type="submit" color="inherit">
                    Submit
                  </Button>
                </DialogActions>
        
        </form>)}
        </Formik>
                </div>
                </Zoom>)}
              </Grid>
               
                
          </Grid>
        </Dialog>
    </div>
  );
}
export default  FormDialog
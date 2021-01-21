
import React, { useState,useContext } from 'react'
import Modal from '@material-ui/core/Modal';
import { makeStyles,RadioGroup,FormControlLabel,Radio,Grid, Button,Box ,colors} from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { useFormik } from 'formik';
import Services from '../../../services/Services'
import { GlobalContext } from "../../../context/GlobalState";
const useStyles = makeStyles((theme) => ({
    root: {},
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      
      padding: theme.spacing(2, 4, 3),
      width: "40%"
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
      },
      selectEmpty: {
        marginTop: theme.spacing(2),
      },
      errorMessage : {
          "color" : colors.red[500]

      }
  }));
 
const NewStoreModal =({openModalwindow,handleClose,goToAddStore})=>{
    const classes = useStyles();
    const [createStore,setCreateStore] = useState("New_store")
    const { assignStoreID } = useContext(GlobalContext);
    //const [selectedStore, setSelectedStore] = useState("")
    const [stores, setStores] = useState([])
    // const handleStore = (event) => {
    //     setSelectedStore(event.target.value)
    //     //console.log(event.target.value)
    // };
    const handleChange = (event) => {
        setCreateStore(event.target.value)
        console.log(createStore)
    };
    const handleRender = async ()=>{
        console.log('render function')
        //console.log(openModalwindow)
        const storesData = await Services.getStore()
        console.log(storesData)
        setStores(storesData.data)
    }
    const validate = values => {
        const errors = {};
        if (!values.selectedStore) {
          errors.selectedStore = 'Please select store';
        }
        return errors;
      };
     
    const formik = useFormik({
        initialValues: {
            selectedStore: '',
        },
        validate,
        onSubmit: values => {
          assignStoreID(values.selectedStore)
          console.log(values.selectedStore)
          goToAddStore()
        },
      });

    return ( 
    <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openModalwindow}
        onRendered = {handleRender}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
        timeout: 500,
        }}
        width = "300"
    >
    <Fade in={openModalwindow}>
      <div className={classes.paper}>
        <RadioGroup row aria-label="Create store" name="createStore" value={createStore} onChange={handleChange}>
            <FormControlLabel value="New_store" control={<Radio />} label="New store" />
            <FormControlLabel value="New_branch" control={<Radio />} label="New branch of existing store" />
        </RadioGroup>
        { createStore === "New_branch" && (
            <form onSubmit={formik.handleSubmit}>
        <Grid
            item
            md={12}
            xs={12}
            
            >
           <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Select Store</InputLabel>
            
                <Select
                    fullWidth
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={formik.values.selectedStore}
                   // onChange={handleStore}
                    onChange={formik.handleChange}
                    name="selectedStore"
                    
                    >
                    {stores.map((store)=>(
                        <MenuItem key={store._id} value={store._id} >
                        {store.name}
                        </MenuItem>
                    ))}
                </Select>
                {formik.errors.selectedStore ? <div className={classes.errorMessage}>{formik.errors.selectedStore}</div> : null}
            </FormControl>
            <Box
            display="flex"
            justifyContent="flex-end"
            >
                
                <Button
                color="primary"
                variant="contained"
               // onClick={goToAddStore}
                type="submit"
                >
                Create new branch
                </Button>
            </Box>
        </Grid>
        </form>
        )}
        { createStore === "New_store"  &&(
            <Box
            display="flex"
            justifyContent="flex-end"
            >
                
                <Button
                
                color="primary"
                variant="contained"
                onClick={goToAddStore}
                >
                Create new store
                </Button>
            </Box>
        )}



      </div>
    </Fade>
  </Modal>
    )
}

export default NewStoreModal;
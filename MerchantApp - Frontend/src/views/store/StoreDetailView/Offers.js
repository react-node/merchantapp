import React, { useContext, useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CustomTable from '../../offer/components/TableComponent'
import { GlobalContext } from "../../../context/GlobalState";
import Services from 'src/services/Services';
import { SettingsCellOutlined } from '@material-ui/icons';
import {  useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import ConfirmationDialogTwo from 'src/views/offer/components/ConfirmationDialogTwo';


const Offers = ()=>{
    console.log("Offers component")
    const [rows,setRows] = useState([])
    const [count,setCount] = useState(0)
    const {selectedStore,setLoading,setSelectedOffer} = useContext(GlobalContext);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate()
    const [dialogOpen,setDialogOpen] = useState(false)

    const alertPosition = { horizontal: "right", vertical: "top" }

    const getStoreOffers = async (page=1,pageSize=5)=>{
        try{
            const storeID = selectedStore._id
            if(storeID){
                const offerdata = await Services.getOffers(page,{storeID},pageSize)
                setRows(offerdata.data.offersData)
                setCount(offerdata.data.count)
            }
            
        }catch(error){
            console.log(error)
            enqueueSnackbar('Something went wrong, Please try again...!',   { variant: "error","anchorOrigin" : alertPosition } );

            setRows([])
            setCount(0)
        }

    }
    const edithandling=(selectedOffers,storeID)=>{
        const selectedOfferData = rows.filter((item)=> item._id===selectedOffers[0])
        setSelectedOffer({...selectedOfferData[0],isEditFromIndividualStore : true,editFromStoreID :storeID})
        if(selectedOfferData[0].storeID.length >1){
            setDialogOpen(true)

        }else{
            gotoEdit()
        }
        
    }
    const gotoEdit = ()=>{
        navigate("/app/offer/editOffer")
    }
    const deletehandling= (selectedOffers,storeID)=>{
        console.log(selectedOffers,storeID)
    }
    const handleDialogClose =()=>{
        setDialogOpen(false)
        setSelectedOffer({})
    }
    useEffect(()=>{
        getStoreOffers()
    },[])

    return (
        <Typography component="span">
            <Grid component="span">
                <CustomTable 
                    rows={rows}
                    pageCount = {count}
                    getStoreOffers = {getStoreOffers}
                    storeID = {selectedStore._id}
                    editHandling={edithandling}
                    deleteHandling= {deletehandling}
                />
                <ConfirmationDialogTwo 
                    open={dialogOpen}
                    handleSubmit = {gotoEdit}
                    handleCancel = {handleDialogClose}
                    message = "Hey, This offer assigned to multiple stores so if you modify and save the changes then it will create as new offer for this perticular store only. These modifications will not update to existing offer. Do you want to continue?"
                />
            </Grid>
        </Typography>
    )
}

export default Offers
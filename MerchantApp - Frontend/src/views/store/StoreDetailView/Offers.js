import React, { useContext, useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CustomTable from '../../offer/components/TableComponent'
import { GlobalContext } from "../../../context/GlobalState";
import Services from 'src/services/Services';
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
    const [dialogDeleteOpen,setDialogDeleteOpen] = useState(false)
    const [isSingleStores,setIsSingleStores] = useState(false)
    const [deleteOffersData,setDeleteOffersData] = useState([])
    const [deleteStoreID,setDeleteStoreID] = useState('')

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
       // const  selectedOffersData = rows.filter(({_id})=> (selectedOffers.includes(_id)) )
        setDeleteStoreID(storeID)
       // console.log(selectedOffersData)
        setDeleteOffersData(selectedOffers)
        setDialogDeleteOpen(true)
       
    }
    const gotoDeleteOffer =  ()=>{
        try{
            setDialogDeleteOpen(false)
            setLoading(true)
            console.log(deleteOffersData)
            Promise.all(
                deleteOffersData.map(async (data)=>{
                    const OfferID = data
    
                    const response = await Services.deleteOffer(OfferID,deleteStoreID)
                    return response
                })
            ).then((resultData)=>{
                setLoading(false)
                getStoreOffers()
                enqueueSnackbar('Deleted Successfully...!',   { variant: "success","anchorOrigin" : alertPosition } );

            }).catch((err)=>{
                setLoading(false)
                enqueueSnackbar('Something went wrong, Please try again...!',   { variant: "error","anchorOrigin" : alertPosition } );

            })
            
            // const 
            // const response = await Services.deleteOffer()

        }catch(err){
            enqueueSnackbar('Something went wrong, Please try again...!',   { variant: "error","anchorOrigin" : alertPosition } );

            console.log("error in delete offer from individual store",err)
        }
    }
    const handleDialogClose =()=>{
        setDialogOpen(false)
        setSelectedOffer({})
    }
    const handleDialogDeleteClose =()=>{
        setDialogDeleteOpen(false)
        setIsSingleStores(false)
        //setSelectedOffer({})
    }
    useEffect(()=>{
        getStoreOffers()
   // eslint-disable-next-line react-hooks/exhaustive-deps
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
                <ConfirmationDialogTwo 
                    open={dialogDeleteOpen}
                    handleSubmit = {gotoDeleteOffer}
                    handleCancel = {handleDialogDeleteClose}
                    message = {`${isSingleStores ?'Hey, This offer assigned to multiple stores so if you delete, It will delete for this perticular store only.' : 'Are you sure, ' }  Do you want to delete?`}
                />
            </Grid>
        </Typography>
    )
}

export default Offers
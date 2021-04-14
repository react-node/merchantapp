import React, { useContext, useEffect, useRef, useState } from 'react'
import {  Avatar,
    CircularProgress,
  colors,
  Grid,
  GridList,
  GridListTile,
  GridListTileBar,
  IconButton,
  makeStyles,
  Paper,
  TextField,
  Typography} from '@material-ui/core';
import ApprovedButton from '../../CommonComponents/ApprovedButton'
import RejectedButton from '../../CommonComponents/RejectedButton'
import useGetStoreImages from '../../customHooks/useGetStoreImages'
import { GOOGLE_STORAGE_PUBLIC_URL } from 'src/utils/config'
import ImageListView from "../../../store/StoreDetailView/ImagesListView"
import DoneIcon from '@material-ui/icons/Done';
import { Autocomplete } from '@material-ui/lab';
import {GlobalContext} from 'src/context/GlobalState'
import { useNavigate, useParams } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  avatar: {
    height: 200,
    width: 400
  },
  paper: {
      padding: theme.spacing(2),
      maxWidth: "100%",
    },
    image: {
      width: 128,
      height: 128,
    },
    img: {
      margin: 'auto',
      display: 'block',
      maxWidth: '100%',
      maxHeight: '100%',
    },
    statsIcon:{
        color:colors.green[300]
    },
    editIcon:{
        color: colors.blue[300]
        
    },
    statusBadge:{
      marginLeft: 10,
      borderRadius: 10,
      paddingLeft:15,
      paddingRight:15
    },
    approved:{
      color: "#29d630",
      backgroundColor: "rgb(24 226 32 / 28%)",
     
    },
    submitted:{
      color: "#252e9a",
      backgroundColor: "rgb(54 95 244 / 20%)",
     
    },
    rejected:{
      color: "#f44336",
      backgroundColor: "rgb(232 106 97 / 21%)",
    }
}));
const StoresInfoView =({statusArray})=>{
    const classes = useStyles()
    const {storeID} = useParams()

    const [storeImages,updateStoreImageStatus,getStoreImagesInfo] = useGetStoreImages()
    const [isLoading, setIsLoading]  = useState(false)
    const [isStatusChange, setIsStatusChange]  = useState(false)
    const [imagesData,setImagesdata] = useState([])
    const [statusFilter,setStatusFilter] = useState("")
    const {setLoading} = useContext(GlobalContext)
    const [selectedImages,setSelectedImages]=useState([])
    const navigate = useNavigate()
    const [page, setPage] = useState(0);

     // add loader refrence 
  const loader = useRef(null);
 
  useEffect(() => {
       var options = {
          root: null,
          rootMargin: "20px",
          threshold: 1.0
       };
      // initialize IntersectionObserver
      // and attaching to Load More div
       const observer = new IntersectionObserver(handleObserver, options);
       if (loader.current) {
          observer.observe(loader.current)
       }
       imagesData.map((item=> item.isSelect= false))
       console.log(imagesData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(()=>{
        setImagesdata(storeImages)
        // eslint-disable-next-line react-hooks/exhaustive-deps
        },[storeImages])
    const handleObserver = (entities) => {
    
        const target = entities[0];
        if (target.isIntersecting) {   
            setPage((page) => page + 1)
        }
      }
      useEffect(() => {
        // here we simulate adding new posts to List
        if(page){
          getMoreData(page,statusFilter,isStatusChange)
          setIsStatusChange(false)
          console.log("call function to get new records",page)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [page,statusFilter])
    const getMoreData = async (page,filterStatus,isStatusChange)=>{
        try {
            setLoading(true)
           // setIsLoading(true)
            await getStoreImagesInfo(page,filterStatus,isStatusChange)
           // setIsLoading(false)
            setLoading(false)
        } catch (error) {
           // setIsLoading(false)
            setLoading(false)
            
        }
       
    }
    const selectImage=(id)=>{
        //let image= selectedImages
        console.log(imagesData)
        let isNew = !selectedImages.includes(id)
        if(isNew){
          setSelectedImages([...selectedImages,id])
    
        }else{
          //selectedImages.splice(id,1)
          const filteredItems = selectedImages.filter(function(item) {
            return item !== id
          })
          setSelectedImages(filteredItems)
        }
       const modifiedArray = imagesData.map((item)=>{ 
          if(item._id === id){
            item.isSelect = !item.isSelect
          }
          return item
        })
        setImagesdata(modifiedArray)
      }
    const ChangeFilter=async (e,value)=>{
        if(value !== statusFilter){
            setIsStatusChange(true)
            await setPage(0)
        }
        setStatusFilter(value)
        // navigate("/app/admin/merchant/storeImages/"+storeID+"?status="+value,{replace:true})
        // console.log(value)
        
        setPage(1)
       
    }
      
    const approveUser =()=>{
        updateStoreImageStatus(selectedImages,2,"")
    }
    const rejectUser =(rejectedMessage)=>{
      console.log(rejectedMessage)
      updateStoreImageStatus(selectedImages,3,rejectedMessage)

    }
    

    return ( <div className={classes.root}>
      <Paper className={classes.paper}>
      <Grid
        
        container
        spacing={3}
        >
      <Grid
        item
        md={6}
        xs={12}
        style={{textAlign:"right", alignSelf:'center' }}
        >
        {selectedImages.length>0 &&  (
            <>
            <ApprovedButton onButtonClick={approveUser}/>
                    &nbsp; 
            <RejectedButton onButtonClick={rejectUser}/>
            </>
        )}
       </Grid>
      <Grid
        item
        md={6}
        xs={12}
        >
        <Autocomplete
            id="status"
            options={statusArray}
            
            name="status"
            getOptionLabel={(option) =>typeof option === 'string' ? option : option.toString()}
            onChange={ChangeFilter}
            renderInput={(params) =>
                <TextField {...params} label="Select Status" variant="outlined" 
                
            />}
            /> 
            </Grid>
           
        </Grid>
      <br/>
      <GridList  className={classes.gridList} cols={3} component={"span"}>
        {imagesData.map((item) => (
          <GridListTile key={item._id} cols={item.cols || 1} component={"span"} onClick={()=>selectImage(item._id)}>
            <Avatar
            component={"span"}
            alt={item.image}
            src={GOOGLE_STORAGE_PUBLIC_URL+item.ownerID+"/"+item.image}
            variant="square"
            className={classes.avatar}
          />
          <GridListTileBar
              title={item.image}
              subtitle={<span>Uploaded Date: {item.createdAt.slice(0, 10)}
              {item.status ===1 ? <span className={`${classes.statusBadge} ${classes.submitted}`}>Submitted</span> : 
              (item.status ===2 ? <span className={`${classes.statusBadge} ${classes.approved}`}>Approved</span> : 
              <span className={`${classes.statusBadge} ${classes.rejected}`}>Rejected</span>)}
              </span>}
              actionIcon={
                <IconButton aria-label={`info about ${item.image}`} className={classes.icon}>
                  {item.isSelect && <DoneIcon style={{color:'rgb(255,247,0)'}} fontSize='large' /> }
                </IconButton>
              }
             
            />
          </GridListTile>
        ))}
       
      </GridList>
      <div  className={classes.loading} ref={loader}>
         
      </div>
      </Paper>
      
      </div>)
}
StoresInfoView.defaultProps = {
    statusArray : ['Submitted','Approved','Rejected']
}
export default StoresInfoView
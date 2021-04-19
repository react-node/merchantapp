import { useContext, useState } from 'react'
import { useSnackbar } from 'notistack'
import AdminServices from 'src/services/AdminServices';
import { Context as UserManagemantContext } from '../userManagement/Context/userManagementContext';

const useUsers = () =>{
    const [rows,setRows] = useState([])
    const [filterData,setFilterData] = useState({})
    const [count,setCount] = useState(0)
    const { enqueueSnackbar } = useSnackbar();
    const alertPosition = { horizontal: "right", vertical: "top" }
    const {updateSearchCriteria} = useContext(UserManagemantContext)
    console.log("custom hook get all users data.....")
    const getUsers = async (page=1,pageSize=5,order="desc",orderBy = "_id",searchCriteria={},filter={},userType=0)=>{
        try{
            setRows([])
            console.log(searchCriteria)
            console.log(filter)
            if(Object.keys(filter).length === 0){
                //filter = filterData
                filter = JSON.parse(localStorage.getItem("contextFilterData") || JSON.stringify(filterData) )
            }else{
                setFilterData(filter)
            }
            // if(Object.keys(searchCriteria).length === 0){
            //     searchCriteria = searchData
            // }else{
            //     setSearchData(searchCriteria)
            // }
            
              updateSearchCriteria({page,pageSize,order,orderBy})
              const offerdata = await AdminServices.getUsers(page,pageSize,order,orderBy,userType,searchCriteria,filter)
              let resultData = offerdata.data.users
              if(offerdata.data.count === 0){
                resultData = [{error:-1, message : "Records not found..."}]
              }
              setRows(resultData)
              setCount(offerdata.data.count)
           
            
        }catch(error){
            console.log(error)
            setRows([{error:-1, message : "Something went wrong, Please try again...!"}])
            enqueueSnackbar('Something went wrong, Please try again...!',   { variant: "error","anchorOrigin" : alertPosition } );
    
           // setRows([])
            setCount(0)
        }
      }
      return [rows,count,getUsers]
}

export default useUsers
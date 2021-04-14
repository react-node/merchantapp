import axios from "axios";
import { useNavigate } from 'react-router-dom'
const useServices = ()=>{
    const navigate = useNavigate()
    console.log("custom hook to get the data from services...")
    const GenerateHeaders =()=>{
        const token = window.sessionStorage.getItem('token')
        var headers = {
            "headers" : {
                "Authorization" : `Bearer ${token}`
            } 
        }
        return headers
    }
    const get = async (URL)=>{
        try {
            const headers = GenerateHeaders()
    
            const response = await axios.get(URL,headers);
            return response
        } catch (error) {
            console.log(error)
            if(error.response.status === 401){
                window.sessionStorage.removeItem('token')
                navigate("/")
            }
             

            throw error
        }

    }
    const post = async (URL,requestBody)=>{
        try {
            console.log("post method calling....")
            const headers = GenerateHeaders()
            const response = await axios.post(URL,requestBody,headers);
            return response
           
        } catch (error) {
            throw error
        }

    }
    const put = async (URL,requestBody)=>{
        try {
            console.log("put method calling....")
            const headers = GenerateHeaders()
            const response = await axios.put(URL,requestBody,headers);
            return response
           
        } catch (error) {
            if(error.response.status === 401){
                window.sessionStorage.setItem('token',null)
                navigate("/")
            }
            throw error
        }

    }
    

    return {get,post,put}



}
export default useServices
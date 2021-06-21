import axios from "axios";
import { useNavigate } from 'react-router-dom'

const useServiceCalls = ()=>{
    const navigate = useNavigate()
    console.log("custom hook to get the data from services...")
    const GenerateHeaders =()=>{
        const token = window.sessionStorage.getItem('accessToken') 
        if(!token) navigate("/")
        //const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MjI4MjgzNzMsImV4cCI6MTYyMjgzOTE3MywiYXVkIjoiNjA2NmJmNjk1NzQ1NGUwNzA4NWMyNGU5IiwiaXNzIjoidGVjaGJpOCJ9.uwzO8mcrM1WFrJ_-10NeWMy0-ZvuDfNhKMGL0CwPBYc" 
        var headers = {
            "headers" : {
                "Authorization" : `Bearer ${token}`
            } 
        }
        return headers
    }
    const redirectToLogin=()=>{
        window.sessionStorage.removeItem('token')
        //navigate("/")
    }
    const get = async (URL,isHeaderRequired=true)=>{
        try {
            var headers={}
            if(isHeaderRequired){
                 headers = GenerateHeaders()
            }
    
            const response = await axios.get(URL,headers);
            return response
        } catch (err) {
            console.log(err)
            if (err.response) {
                // client received an error response (5xx, 4xx)
               if(err.response.status === 401){
                    redirectToLogin()
                }
               console.log("error in api call")
              } else if (err.request) {
                // client never received a response, or request never left
                console.log("request failed and no response ")
              } else {
                // anything else
                console.log("request failed due to slow network")
        
              }
            
             

            throw err
        }

    }
    const post = async (URL,requestBody,isHeaderRequired=true)=>{
        try {
            console.log("post method calling....")
            var headers={}
            if(isHeaderRequired){
                 headers = GenerateHeaders()
            }

           
            const response = await axios.post(URL,requestBody,headers);
            return response
           
        } catch (error) {
            if(error.response.status === 401){
                redirectToLogin()
            }
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
                redirectToLogin()
            }
            throw error
        }

    }
    

    return {get,post,put}



}
export default useServiceCalls
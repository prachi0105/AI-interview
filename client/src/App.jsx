import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "./redux/userSlice";
import Interviewpage from "./pages/InterviewPage";
import InterviewHistory from './pages/InterviewHistory.jsx'
import InterviewReport from "./pages/InterviewReport.jsx";
import Pricing from "./pages/pricing.jsx";

export const serverUrl = "http://localhost:8000";

function App() {

  const dispatch = useDispatch()

  useEffect(() => {
       const getUser = async() =>{
        
      try{
        const result = await axios.get(serverUrl+"/api/user/current-user", {withCredentials: true})
        dispatch(setUserData(result.data))
      }catch(error){
        console.log("Error fetching current user:", error);
          console.log("Status:", error.response?.status);
  console.log("Data:", error.response?.data);
  console.log("Error:", error);
        dispatch(setUserData(null))
      }

       }

       getUser()
  },[dispatch])
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/interview" element={<Interviewpage />} />
      <Route path='/history' element={<InterviewHistory/>}/>

      <Route path='/pricing' element={<Pricing/>}/>
       <Route path='/report/:id' element={<InterviewReport/>}/>




    </Routes>
  );
}

export default App;













import User from "../models/user.model.js";

export const getCurrentuser = async(req,res) =>{
  try{
    const userid = req.userId;
    const user = await User.findById(userid)

    if(!user){
        return res.status(404).json({message: "User not found"})
    }
    return res.status(200).json(user)
    
  }catch(error){
    return res.status(500).json({message: "Error in get current user controller"+{error}})
  }
}

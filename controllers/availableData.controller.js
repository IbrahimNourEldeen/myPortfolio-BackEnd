const User = require('../models/user.model')


const getNaturalData = async (req,res)=>{
    try{
        const data = await User.find({},{__v:0,refreshToken:0,createdAt:0,role:0,email:0,password:0});
        if(!data){
            return res.status(404).json({
                status:"fail",
                data:{
                    message:"Data Not Found."
                }
            })
        }
        res.status(200).json({
            status:"success",
            data:data[1]
        })
    }catch(error){
        return res.status(500).json({
            status:"error",
            message:"server error",
            error:error.message
        })
    }
};

module.exports = {
    getNaturalData
}

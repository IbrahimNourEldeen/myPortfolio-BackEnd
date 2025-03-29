const jwt =require('jsonwebtoken')

// module.exports= (payload)=>{
//     const token = jwt.sign(
//         payload,
//         process.env.SEKRET_KEY,
//         {expiresIn:"10m"}
//     )
//     return token
// }
const generateAccessToken = (payload)=>{
    return jwt.sign(
        payload,
        process.env.SEKRET_KEY,
        {expiresIn:"1m"}
    )
}

const generateRefreshToken = (payload)=>{
    return jwt.sign(
        payload,
        process.env.REFRESH_SEKRET_KEY,
        {expiresIn:"10d"}
    )
}

module.exports = {
    generateAccessToken,
    generateRefreshToken
}
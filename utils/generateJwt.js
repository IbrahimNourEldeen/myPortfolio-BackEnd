const jwt =require('jsonwebtoken')

const generateAccessToken = (payload)=>{
    return jwt.sign(
        payload,
        process.env.SEKRET_KEY,
        {expiresIn:"10m"}
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
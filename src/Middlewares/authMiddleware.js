import { StatusCodes } from "http-status-codes"
import { JwtProvider } from "../Utils/JwtProvider.js"
import 'dotenv/config'

const isAuthozied = async (req, res, next)=>{
    const accessTokenFromCookie = req.cookies?.accessToken
    console.log('accessTokenFromCookie: ',accessTokenFromCookie)
    if (!accessTokenFromCookie){
        res.status(StatusCodes.UNAUTHORIZED).json({message: 'Please Login'})
        return
    }

    try{
        const accessTokenDecoded = await JwtProvider.verifyToken(
            accessTokenFromCookie,
            process.env.ACCESS_TOKEN_SECRET_SIGNATURE
        )

        req.jwtDecoded = accessTokenDecoded
        next()
    } 
    catch (error){
        console.log('Error from authMidleware: ',error)

        if (error.message?.includes('jwt expired')){
            res.status(StatusCodes.GONE).json({message: 'Need to refresh token'})
            return
        }

        res.status(StatusCodes.UNAUTHORIZED)
    }

}

export const authMiddleware = {
    isAuthozied
}
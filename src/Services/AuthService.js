import {pool} from "../Db/connection.js"
import { JwtProvider } from "../Utils/JwtProvider.js"
import 'dotenv/config'

const ACCESS_TOKEN_SECRET_SIGNATURE = process.env.ACCESS_TOKEN_SECRET_SIGNATURE;
const REFRESH_TOKEN_SECRET_SIGNATURE = process.env.REFRESH_TOKEN_SECRET_SIGNATURE;

const Login = async (username, password) => {
    try{
        const [user] = await pool.query("select * from Account_List where username = ?",[username])

        if (user.length === 0){
            throw Error('Username không tồn tại')
        }

        if(user[0].password !== password){
            throw Error('Mật khẩu không chính xác')
        }

        const userInfo = {
            username: user[0].username,
            role: user[0].role
        }

        const accessToken = await JwtProvider.generateToken(
            userInfo,
            ACCESS_TOKEN_SECRET_SIGNATURE,
            "1h"
        )

        const refreshToken = await JwtProvider.generateToken(
            userInfo,
            REFRESH_TOKEN_SECRET_SIGNATURE,
            "14 days"
        )

        return {accessToken, refreshToken, userInfo}

    }
    catch(err){
        throw err
    }
}

const getUserInfo = async (username) => {
    try{
        const [user] = await pool.query("select * from Account_List where username = ?",[username])

        if (user.length === 0){
            throw Error('Username không tồn tại')
        }

        return {user}

    }
    catch(err){
        throw err
    }
}



export const AuthService = {
    Login,
    getUserInfo
}
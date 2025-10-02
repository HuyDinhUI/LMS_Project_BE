import { AuthService } from "../Services/AuthService.js";
import ms from "ms";
import StatusCode from "http-status-codes"

const Login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const result = await AuthService.Login(username, password);
    const accessToken = result.accessToken
    const refreshToken = result.refreshToken
    const userInfo = result.userInfo

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: ms("14 days"),
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: ms("14 days"),
    });

    res.status(StatusCode.OK).json({
        message: "Đăng nhập thành công",
        ...userInfo,
        accessToken,
        refreshToken

    })
  } catch (err) {
    res.status(StatusCode.UNAUTHORIZED).json({ message: err.message });
  }
};

const getUserInfo = async (req, res, next) => {
  const username = req.jwtDecoded.username
  try{
    const result = await AuthService.getUserInfo(username)
    res.status(StatusCode.OK).json(result)
  }
  catch(err){
    res.status(StatusCode.UNAUTHORIZED).json({message: err.message})
  }
}

const Logout = async (req, res) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure:true,
      sameSite: "None",
    });
    res.status(StatusCode.OK).json({ message: "Log out success" });
  } catch (error) {
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json(error);
  }
};

export const AuthController = {
  Login,
  getUserInfo,
  Logout
};

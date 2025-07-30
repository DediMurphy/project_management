import {
  registerUser,
  loginUser,
  refreshTokenAccess,
} from "../service/authService.js";
import sendResponse from "../middlewares/responseFormatter.js";

export const register = async (req, res, next) => {
  try {
    const result = await registerUser(req.body);
    sendResponse(res, {
      statusCode: 201,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await loginUser(req.body);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    sendResponse(res, {
      statusCode: 200,
      message: "Login successful",
      data: { accessToken, user },
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

export const refreshAccessToken = (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    const newAccessToken = refreshTokenAccess(token);

    sendResponse(res, {
      statusCode: 200,
      message: "Token refreshed",
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    res.status(403);
    next(error);
  }
};

export const logout = (req, res, next) => {
  try {
    res.clearCookie("refreshToken");
    sendResponse(res, {
      statusCode: 200,
      message: "Logged out successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

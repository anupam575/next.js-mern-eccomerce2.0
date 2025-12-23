
import { formatUser } from "../utils/formatUser.js";

const sendToken = async (user, statusCode, res) => {
  // 🔐 Token generate ONLY from user instance
  const accessToken = user.getAccessToken();
  const refreshToken = user.getRefreshToken();

  // 💾 Save refresh token in DB
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const isProduction = process.env.NODE_ENV === "production";

  const cookieOptions = (expiresIn) => ({
    expires: new Date(Date.now() + expiresIn),
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    path: "/",
  });

  res
    .status(statusCode)
    .cookie("accessToken", accessToken, cookieOptions(15 * 60 * 1000))
    .cookie("refreshToken", refreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000))
    .json({
      success: true,
      user: formatUser(user),
    });
};

export default sendToken;

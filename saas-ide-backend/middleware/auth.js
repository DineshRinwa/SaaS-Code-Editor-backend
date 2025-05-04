const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  // console.log(process.env.ACCESS_TOKEN_SECRET, "A-",accessToken, "R-", refreshToken)

  // Try verifying access token if it exists
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

      req.user = decoded;
      return next();
    } catch (error) {
      if (error.name !== "TokenExpiredError") {
        // Invalid token (e.g., bad signature), don’t try refresh
        return res.status(401).json({ message: "Invalid access token" });
      }
      // If TokenExpiredError, fall through to refresh logic below
    }
  }

  // No access token or expired access token, try refresh token
  if (refreshToken) {
    try {
      // Verify refresh token
      const decodedRefresh = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      // Generate new access token
      const newAccessToken = jwt.sign(
        { id: decodedRefresh.id, email: decodedRefresh.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      // Set new access token in cookies
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000,
        sameSite: "strict",
      });

      // Attach user data and proceed
      req.user = decodedRefresh;
      return next();
    } catch (refreshError) {
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }
  }

  // No access token and no refresh token (or refresh failed)
  return res.status(401).json({ message: "Authentication required" });
};

module.exports = authMiddleware;
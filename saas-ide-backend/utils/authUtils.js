const jwt = require("jsonwebtoken");

// Generate Access and Refresh Tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" } // Short-lived access token
  );

  const refreshToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" } // Long-lived refresh token
  );

  return { accessToken, refreshToken };
};

// Set Tokens in Cookies
// const setTokensInCookies = (res, accessToken, refreshToken) => {
//   res.cookie("accessToken", accessToken, {
//     httpOnly: true, // Prevents client-side JS access
//     secure: process.env.NODE_ENV === "production", // Use secure in production
//     maxAge: 15 * 60 * 1000, // 15 minutes
//     sameSite: "strict", // Prevents CSRF
//   });

//   res.cookie("refreshToken", refreshToken, {
//     httpOnly: true, // Prevents client-side JS access
//     secure: process.env.NODE_ENV === "production",
//     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     sameSite: "strict",
//   });
// };

const setTokensInCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, // Prevents client-side JS access
    // secure: process.env.NODE_ENV === "production", // Original - we'll make it always true with SameSite=None
    secure: true, // *** IMPORTANT: Must be true for SameSite=None ***
    maxAge: 15 * 60 * 1000, // 15 minutes
    sameSite: "None", // *** CHANGE THIS FROM "strict" TO "None" ***
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // Prevents client-side JS access
    // secure: process.env.NODE_ENV === "production", // Original - we'll make it always true with SameSite=None
    secure: true, // *** IMPORTANT: Must be true for SameSite=None ***
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: "None", // *** CHANGE THIS FROM "strict" TO "None" ***
  });
};

module.exports = { generateTokens, setTokensInCookies };
const express = require("express");
const cors = require('cors');
const cookieParser = require("cookie-parser");
require("dotenv").config();
const connectDB = require("./Config/db"); // Import DB function

const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors({
  origin: "*", // Allow all origins (temporary, for no frontend)
  credentials: true // Still supports cookies for auth
}));
app.use(cookieParser());
app.use(express.json()); // Middleware to parse JSON bodies


const userRoute = require("./routes/registerRoute");
const loginRoute = require("./routes/loginRoute");
const snippetRoute = require("./routes/snippetRoute");
const commentRoute = require("./routes/commentRoute");
const proUser = require("./routes/proUser");

app.use("/api/register", userRoute);
app.use("/api/login", loginRoute);
app.use("/api/snippets", snippetRoute);
app.use("/api/snippets/comment", commentRoute);
app.use("/api/proUser", proUser);

//  Home request
app.get("/", (req, res) => {
  res.send("Welcome To Home Page...");
});

// Start server with DB connection
app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Server is running on port ${PORT}`);
});
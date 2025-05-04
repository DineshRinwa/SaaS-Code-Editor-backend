const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const connectDB = require("./Config/db"); // Import DB function

const PORT = process.env.PORT || 4000;
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://saa-s-code-editor.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies and authentication headers
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow these HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
  })
);
app.use(cookieParser());
app.use(express.json()); // Middleware to parse JSON bodies

const userRoute = require("./routes/user");
const snippetRoute = require("./routes/snippetRoute");
// const commentRoute = require("./routes/commentRoute");

app.use("/api/auth", userRoute);
app.use("/api/snippets", snippetRoute);
// app.use("/api/snippets/comment", commentRoute);

//  Home request
app.get("/home", (req, res) => {
  res.json({ message: "Welcome To Home Page..." });
});

// Start server with DB connection
app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Server is running on port ${PORT}`);
});
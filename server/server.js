const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true
  }
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:5173", "http://localhost:5174", "https://gram-bazar.vercel.app"];
      if (!origin || allowedOrigins.includes(origin) || origin.includes("localhost") || origin.includes("127.0.0.1")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
  })
);
app.use(express.json());
app.use(cookieParser());

// Serve local uploads statically
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (req, res) => res.json({ success: true, data: {}, message: "GramBazaar API healthy" }));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/listings", require("./routes/listingRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/delivery", require("./routes/deliveryRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

io.on("connection", (socket) => {
  console.log("[SOCKET] Client connected", socket.id);
  socket.on("disconnect", () => console.log("[SOCKET] Client disconnected", socket.id));
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`[SERVER] GramBazaar running on port ${PORT}`);
});

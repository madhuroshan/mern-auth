import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import cors from "cors";
import path from "path";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;
const __dirname = path.resolve();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json()); // to parse json data from the request body
app.use(cookieParser()); // to parse cookies from the request headers
//auth routes
app.use("/api/auth", authRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

// Server started on port
app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});

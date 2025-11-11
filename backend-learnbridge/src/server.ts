import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import uploadRoutes from "./routes/upload";
import tutorRoutes from "./routes/tutor";
import requestRoutes from "./routes/request";
import favoriteRoutes from "./routes/favorite";
import reviewRoutes from "./routes/review";
import { connectDB } from "./database";

dotenv.config();
const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

//routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/tutor", tutorRoutes);
app.use("/api/request", requestRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/reviews", reviewRoutes);

const port = process.env.PORT || 5000;

async function startServer() {
    try{
      await connectDB();

      app.listen(port, () => {
        console.log(`🚀 Server running on port ${port}`);
      });
  } catch (err){
      console.error("❌ Failed to start server:", err);
  }
} 

startServer();


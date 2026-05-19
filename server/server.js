import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import taskRoutes from "./routes/tasks.js";
import userRoutes from "./routes/users.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// These two middleware lines let the React app send JSON requests to this API.
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("TaskFlow API is running.");
});

app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

// The MongoDB Atlas URI stays in .env so private login details never go in the code.
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`TaskFlow server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import tasksRoute from "./routers/tasksRoute"

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", tasksRoute)

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => 
  console.log(`Server running on port ${PORT}`)
);
import express from "express";
import cors from "cors";
import helmet from "helmet";

import healthRoutes from "./routes/health.routes";

const app = express();

// Security headers
app.use(helmet());

// Allow frontend requests
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// Parse JSON request body
app.use(express.json());

// API routes
app.use("/api/health", healthRoutes);

export default app;

import "dotenv/config";

import app from "./app";
import prisma from "./config/prisma";

const PORT = Number(process.env.PORT || 5000);

async function startServer() {
  try {
    await prisma.$connect();

    console.log("✅ MySQL connected successfully!");

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });

    const shutdown = () => {
      server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("Database connection failed:", error);

    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();

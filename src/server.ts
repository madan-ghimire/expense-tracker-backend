import createApp from "./app";
import dotenv from "dotenv";
dotenv.config();

const startServer = async (): Promise<void> => {
  try {
    const app = createApp();

    const server = app.listen(process.env.PORT, () => {
      console.info(`🚀 Server running on http://localhost:${process.env.PORT}`);
    });

    // Modern graceful shutdown
    const gracefulShutdown = (signal: string): void => {
      console.log(`\n🔄 Received ${signal}. Shutting down gracefully...`);
      server.close(() => {
        console.log("✅ Server closed");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

void startServer();

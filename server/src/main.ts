import { type Server } from "http";
import mongoose from "mongoose";

import app from "./app";
import logger from "./utils/logger";

const { SERVER_PORT, DATABASE_CONNECTION_STRING } = process.env;

const shutDownGracefully = (server: Server) => () => {
  server.close(async () => {
    logger.info("Stopped the server");
    await mongoose.connection.close();
  });
};

const main = async () => {
  if (!SERVER_PORT || !DATABASE_CONNECTION_STRING) {
    logger.error("Missing environment variables");
    process.exit(1);
  }

  mongoose.connection.on("connected", () => {
    logger.info("Connected to database");
  });
  mongoose.connection.on("error", (error) => {
    logger.error(error.stack || error.message);
  });
  mongoose.connection.on("disconnected", () => {
    logger.info("Disconnected from database");
    mongoose.connection.removeAllListeners();
  });
  try {
    await mongoose.connect(DATABASE_CONNECTION_STRING);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.stack || error.message);
    }
    process.exit(1);
  }

  const server = app.listen(SERVER_PORT, () => {
    logger.info("Started the server");
  });

  process.on("SIGINT", shutDownGracefully(server));
  process.on("SIGTERM", shutDownGracefully(server));
};

main();

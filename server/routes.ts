import type { Express } from "express";
import { createServer, type Server } from "node:http";
import { setupSession, setupAuth } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  setupSession(app);
  setupAuth(app);

  const httpServer = createServer(app);
  return httpServer;
}

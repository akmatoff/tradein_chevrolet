import "dotenv/config";
import { Bot } from "./bot/Bot";
import { Server } from "./server/server";

const bot = new Bot();
const server = new Server();

server.run();
bot.init();

process.on("SIGINT", () => {
  bot.stop();
  process.exit(0);
});

process.on("SIGTERM", () => {
  bot.stop();
  process.exit(0);
});

import "dotenv/config";
import { Bot } from "./bot/Bot";

const bot = new Bot();

bot.init();

process.on("SIGINT", () => {
  bot.stop();
  process.exit(0);
});

process.on("SIGTERM", () => {
  bot.stop();
  process.exit(0);
});

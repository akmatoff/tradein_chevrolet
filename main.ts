import "dotenv/config";

import { Telegraf } from "telegraf";
import { BOT_TOKEN } from "./env.js";

const bot = new Telegraf(BOT_TOKEN);

async function init() {
  await bot.telegram.setMyCommands([
    { command: "/add", description: "Добавить запись" },
  ]);

  bot.start((ctx) => ctx.reply("Добро пожаловать в Trade-in Chevrolet!"));
  bot.launch();
}

init();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
